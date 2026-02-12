from elasticsearch import Elasticsearch,RequestError
from elasticsearch import Elasticsearch, helpers
from elasticsearch.helpers import scan
import re
import json
import csv
import pandas as pd
from datetime import datetime,timedelta
from dateutil import tz
import pytz 
import math
import pandas as pd
import sys
import os
import geoip2.database

from_zone = tz.tzutc()
to_zone = tz.tzlocal()

GEOLITE2_MMDB = os.environ.get(
    "GEOLITE2_MMDB",
    os.path.join(os.path.dirname(__file__), "GeoLite2-Country.mmdb")
)

def get_country(reader, ip):
    """
    Return country name for an IP.
    """
    if not ip:
        return ""
    try:
        response = reader.country(ip)
        return response.country.name or ""
    except Exception:
        return "Unknown"


def enrich_df_with_geoip(df, geoip_db_path):
    """
    Enrich a DataFrame with country information for SourceIP and DstIP.
    
    Args:
        df (pd.DataFrame): Input dataframe containing 'SourceIP' and 'DstIP'
        geoip_db_path (str): Path to GeoLite2 mmdb file
    
    Returns:
        pd.DataFrame: Same dataframe with added country columns
    """
    with geoip2.database.Reader(geoip_db_path) as reader:
        df["Attacker_Country"] = df["Attacker"].apply(
            lambda ip: get_country(reader, ip)
        )
        df["Victim_Country"] = df["Victim"].apply(
            lambda ip: get_country(reader, ip)
        )

    return df

def is_ist(timestamp):
    try:
        dt = datetime.fromisoformat(timestamp)
        return dt.tzinfo.utcoffset(dt) == timedelta(hours=5, minutes=30)
    except Exception as e:
        return False

def utc_to_ist(str):
    try:
        _format="%Y-%m-%dT%H:%M:%S"
        output_time_format = "%d/%m/%Y %H:%M:%S"
        if(is_ist(str)):
            dt = datetime.fromisoformat(str)
            return dt.strftime(output_time_format)
        str = str.split(".")[0]
        given_time = datetime.strptime(str,_format)
        given_time = given_time.replace(tzinfo=from_zone)
        central = given_time.astimezone(to_zone)
        return central.strftime(output_time_format)
    except Exception as e:
        print(e)
        return str
def flatten_json(nested_json):
    flattened_data = []
    def flatten_recursive(nested_json, prefix=''):
        if isinstance(nested_json, dict):
            for key, value in nested_json.items():
                flatten_recursive(value, f"{prefix}{key}_")
        elif isinstance(nested_json, list):
            for i, item in enumerate(nested_json):
                flatten_recursive(item, f"{prefix}{i}_")
        else:
            flattened_data.append({prefix: nested_json})
    flatten_recursive(nested_json)
    single_dict = {key: value for dict_item in flattened_data for key, value in dict_item.items()}
    return single_dict

def create_esConnection():
    try:
        es = Elasticsearch(
            hosts = ['https://192.168.144.167:9200'],
            verify_certs=False,
            ssl_show_warn=False,
            request_timeout=600,
            # ca_certs=super_parent_path+'/certificates/es-cs.crt',
            http_auth=('elastic','CdotCert@18')
        )
        return es
    except Exception as e:
        print("Could not connect to elasticsearch!")
        print(e)
        return None


def convert_to_utc(time_string,format="%d.%m.%Y %H:%M:%S"):
    datetime_object = datetime.strptime(time_string, format)
    ist_timezone = pytz.timezone('Asia/Kolkata')
    localized_datetime = ist_timezone.localize(datetime_object)
    utc_datetime = localized_datetime.astimezone(pytz.utc)
    iso_format = utc_datetime.isoformat()
    return iso_format
    
def get_filename(timestring,prefix='portscan'):
    return prefix+'-'+timestring.replace('.','-').replace(' ','-')

# def main(date_time):
def main():
    esClient = create_esConnection()
    # print(esClient.info)
    time_format = "%d.%m.%Y %H:%M:%S"
    #max_rows_per_file = 1000000
    max_rows_per_file = 100000
    time_range = [
        ['09.02.2026 11:10:00','10.02.2026 13:10:00']
        ]
    # time_range = [
    #    date_time
    #    ]

    filename_list=[]
        
    for tt in time_range:
        #print("Running script for time ",tt[0],tt[1])
        try:
            start_date = convert_to_utc(tt[0])
            end_date = convert_to_utc(tt[1])
            

            # Construct the enhanced query with the 'should' clause
            query = {
                "query": {
                    "bool": {
                    "must": [],
                    "filter": [
                        {
                        "range": {
                            "@timestamp": {
                            "format": "strict_date_optional_time",
                            "gte": start_date,
                            "lte": end_date
                            }
                        }
                        },
                        
                        { "term": {"@type.keyword": "port_scan" } },
                    ],
                    "should": [],
                    "must_not": []
                    }
                }
            }

            index_name = "spark*"
            results = scan(
                esClient,
                index=index_name,
                query=query,
                size=1000,  
                scroll="2m"  
            )
            
            arr = []
            count = 0
            filename = get_filename(tt[0])
            # print(results)
            for message in results:
                #print(message)
                source = message.get('_source',{})
                

                obj = {}
                #obj['stIP'] = source.get('DstIP')
                obj['DetectedAt'] = source.get('detectedAt')
                obj['Attacker'] = source.get('attacker')
                obj['Victim'] = source.get('victim')
                obj['Sample_ports'] = source.get('sample_ports')
                obj['Attack_type'] = source.get('attack_type')
                obj['Protocol'] = source.get('c4_flow')
                obj['Severity'] = source.get('severity')
                obj['Total_syn_packets'] = source.get('total_syn_packets')
                
                arr.append(obj)
                if(len(arr) > max_rows_per_file):
                    df = pd.DataFrame(arr)
                    file_name = filename+'_'+str(count)+'.csv'
                    df.to_csv(file_name,index=False)
                    #arr = []
                    #print("file created with filename ",filename+'_'+str(count)+'.csv')
                    filename_list.append(file_name)
                    count = count + 1
            if(len(arr)>0):
                df = pd.DataFrame(arr)
                file_name = filename+'_'+str(count)+'.csv'
                df.to_csv(file_name,index=False)
                #print("file created with filename ",filename+'_'+str(count)+'.csv')
                filename_list.append(file_name)
            #print("Script completed for time ",tt[0],tt[1])
        except Exception as e:
            print(e)
            print("Query not satisfied")
        return filename_list
    
if __name__=="__main__": 
    print("################################### STARTING Entity CLIENT ###################################")
    #start=sys.argv[1]
    #end=sys.argv[2]
    #date_time=[start,end]
    #filename_list=main(date_time)
    filename_list=main()
    print(filename_list)
    df=pd.DataFrame()
    for file in filename_list:
        df1=pd.read_csv(file)
        final_df=pd.concat([df,df1],axis=0)
    final_df=final_df.drop_duplicates()
    final_df = enrich_df_with_geoip(final_df, GEOLITE2_MMDB)
    final_df.to_csv("portscan.csv",index=False)


