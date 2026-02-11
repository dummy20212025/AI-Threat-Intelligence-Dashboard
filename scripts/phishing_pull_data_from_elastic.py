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

from_zone = tz.tzutc()
to_zone = tz.tzlocal()

def tld_valid_check(domain):                                 # function for checking whether tld is valid in icann
    icann_tlds=['.aaa', '.aarp', '.abb', '.abbott', '.abbvie', '.abc', '.able', '.abogado', '.abudhabi', '.ac', '.academy', '.accenture', '.accountant', '.accountants', '.aco', '.actor', '.ad', '.ads', '.adult', '.ae', '.aeg', '.aero', '.aetna', '.af', '.afl', '.africa', '.ag', '.agakhan', '.agency', '.ai', '.aig', '.airbus', '.airforce', '.airtel', '.akdn', '.al', '.alibaba', '.alipay', '.allfinanz', '.allstate', '.ally', '.alsace', '.alstom', '.am', '.amazon', '.americanexpress', '.americanfamily', '.amex', '.amfam', '.amica', '.amsterdam', '.analytics', '.android', '.anquan', '.anz', '.ao', '.aol', '.apartments', '.app', '.apple', '.aq', '.aquarelle', '.ar', '.arab', '.aramco', '.archi', '.army', '.arpa', '.art', '.arte', '.as', '.asda', '.asia', '.associates', '.at', '.athleta', '.attorney', '.au', '.auction', '.audi', '.audible', '.audio', '.auspost', '.author', '.auto', '.autos', '.aw', '.aws', '.ax', '.axa', '.az', '.azure', '.ba', '.baby', '.baidu', '.banamex', '.band', '.bank', '.bar', '.barcelona', '.barclaycard', '.barclays', '.barefoot', '.bargains', '.baseball', '.basketball', '.bauhaus', '.bayern', '.bb', '.bbc', '.bbt', '.bbva', '.bcg', '.bcn', '.bd', '.be', '.beats', '.beauty', '.beer', '.bentley', '.berlin', '.best', '.bestbuy', '.bet', '.bf', '.bg', '.bh', '.bharti', '.bi', '.bible', '.bid', '.bike', '.bing', '.bingo', '.bio', '.biz', '.bj', '.black', '.blackfriday', '.blockbuster', '.blog', '.bloomberg', '.blue', '.bm', '.bms', '.bmw', '.bn', '.bnpparibas', '.bo', '.boats', '.boehringer', '.bofa', '.bom', '.bond', '.boo', '.book', '.booking', '.bosch', '.bostik', '.boston', '.bot', '.boutique', '.box', '.br', '.bradesco', '.bridgestone', '.broadway', '.broker', '.brother', '.brussels', '.bs', '.bt', '.build', '.builders', '.business', '.buy', '.buzz', '.bv', '.bw', '.by', '.bz', '.bzh', '.ca', '.cab', '.cafe', '.cal', '.call', '.calvinklein', '.cam', '.camera', '.camp', '.canon', '.capetown', '.capital', '.capitalone', '.car', '.caravan', '.cards', '.care', '.career', '.careers', '.cars', '.casa', '.case', '.cash', '.casino', '.cat', '.catering', '.catholic', '.cba', '.cbn', '.cbre', '.cc', '.cd', '.center', '.ceo', '.cern', '.cf', '.cfa', '.cfd', '.cg', '.ch', '.chanel', '.channel', '.charity', '.chase', '.chat', '.cheap', '.chintai', '.christmas', '.chrome', '.church', '.ci', '.cipriani', '.circle', '.cisco', '.citadel', '.citi', '.citic', '.city', '.ck', '.cl', '.claims', '.cleaning', '.click', '.clinic', '.clinique', '.clothing', '.cloud', '.club', '.clubmed', '.cm', '.cn', '.co', '.coach', '.codes', '.coffee', '.college', '.cologne', '.com', '.commbank', '.community', '.company', '.compare', '.computer', '.comsec', '.condos', '.construction', '.consulting', '.contact', '.contractors', '.cooking', '.cool', '.coop', '.corsica', '.country', '.coupon', '.coupons', '.courses', '.cpa', '.cr', '.credit', '.creditcard', '.creditunion', '.cricket', '.crown', '.crs', '.cruise', '.cruises', '.cu', '.cuisinella', '.cv', '.cw', '.cx', '.cy', '.cymru', '.cyou', '.cz', '.dabur', '.dad', '.dance', '.data', '.date', '.dating', '.datsun', '.day', '.dclk', '.dds', '.de', '.deal', '.dealer', '.deals', '.degree', '.delivery', '.dell', '.deloitte', '.delta', '.democrat', '.dental', '.dentist', '.desi', '.design', '.dev', '.dhl', '.diamonds', '.diet', '.digital', '.direct', '.directory', '.discount', '.discover', '.dish', '.diy', '.dj', '.dk', '.dm', '.dnp', '.do', '.docs', '.doctor', '.dog', '.domains', '.dot', '.download', '.drive', '.dtv', '.dubai', '.dunlop', '.dupont', '.durban', '.dvag', '.dvr', '.dz', '.earth', '.eat', '.ec', '.eco', '.edeka', '.edu', '.education', '.ee', '.eg', '.email', '.emerck', '.energy', '.engineer', '.engineering', '.enterprises', '.epson', '.equipment', '.er', '.ericsson', '.erni', '.es', '.esq', '.estate', '.et', '.eu', '.eurovision', '.eus', '.events', '.exchange', '.expert', '.exposed', '.express', '.extraspace', '.fage', '.fail', '.fairwinds', '.faith', '.family', '.fan', '.fans', '.farm', '.farmers', '.fashion', '.fast', '.fedex', '.feedback', '.ferrari', '.ferrero', '.fi', '.fidelity', '.fido', '.film', '.final', '.finance', '.financial', '.fire', '.firestone', '.firmdale', '.fish', '.fishing', '.fit', '.fitness', '.fj', '.fk', '.flickr', '.flights', '.flir', '.florist', '.flowers', '.fly', '.fm', '.fo', '.foo', '.food', '.football', '.ford', '.forex', '.forsale', '.forum', '.foundation', '.fox', '.fr', '.free', '.fresenius', '.frl', '.frogans', '.frontier', '.ftr', '.fujitsu', '.fun', '.fund', '.furniture', '.futbol', '.fyi', '.ga', '.gal', '.gallery', '.gallo', '.gallup', '.game', '.games', '.gap', '.garden', '.gay', '.gb', '.gbiz', '.gd', '.gdn', '.ge', '.gea', '.gent', '.genting', '.george', '.gf', '.gg', '.ggee', '.gh', '.gi', '.gift', '.gifts', '.gives', '.giving', '.gl', '.glass', '.gle', '.global', '.globo', '.gm', '.gmail', '.gmbh', '.gmo', '.gmx', '.gn', '.godaddy', '.gold', '.goldpoint', '.golf', '.goo', '.goodyear', '.google', '.gop', '.got', '.gov', '.gp', '.gq', '.gr', '.grainger', '.graphics', '.gratis', '.green', '.gripe', '.grocery', '.group', '.gs', '.gt', '.gu', '.gucci', '.guge', '.guide', '.guitars', '.guru', '.gw', '.gy', '.hair', '.hamburg', '.hangout', '.haus', '.hbo', '.hdfc', '.hdfcbank', '.health', '.healthcare', '.help', '.helsinki', '.here', '.hermes', '.hiphop', '.hisamitsu', '.hitachi', '.hiv', '.hk', '.hkt', '.hm', '.hn', '.hockey', '.holdings', '.holiday', '.homedepot', '.homegoods', '.homes', '.homesense', '.honda', '.horse', '.hospital', '.host', '.hosting', '.hot', '.hotels', '.hotmail', '.house', '.how', '.hr', '.hsbc', '.ht', '.hu', '.hughes', '.hyatt', '.hyundai', '.ibm', '.icbc', '.ice', '.icu', '.id', '.ie', '.ieee', '.ifm', '.ikano', '.il', '.im', '.imamat', '.imdb', '.immo', '.immobilien', '.in', '.inc', '.industries', '.infiniti', '.info', '.ing', '.ink', '.institute', '.insurance', '.insure', '.int', '.international', '.intuit', '.investments', '.io', '.ipiranga', '.iq', '.ir', '.irish', '.is', '.ismaili', '.ist', '.istanbul', '.it', '.itau', '.itv', '.jaguar', '.java', '.jcb', '.je', '.jeep', '.jetzt', '.jewelry', '.jio', '.jll', '.jm', '.jmp', '.jnj', '.jo', '.jobs', '.joburg', '.jot', '.joy', '.jp', '.jpmorgan', '.jprs', '.juegos', '.juniper', '.kaufen', '.kddi', '.ke', '.kerryhotels', '.kerrylogistics', '.kerryproperties', '.kfh', '.kg', '.kh', '.ki', '.kia', '.kids', '.kim', '.kindle', '.kitchen', '.kiwi', '.km', '.kn', '.koeln', '.komatsu', '.kosher', '.kp', '.kpmg', '.kpn', '.kr', '.krd', '.kred', '.kuokgroup', '.kw', '.ky', '.kyoto', '.kz', '.la', '.lacaixa', '.lamborghini', '.lamer', '.lancaster', '.land', '.landrover', '.lanxess', '.lasalle', '.lat', '.latino', '.latrobe', '.law', '.lawyer', '.lb', '.lc', '.lds', '.lease', '.leclerc', '.lefrak', '.legal', '.lego', '.lexus', '.lgbt', '.li', '.lidl', '.life', '.lifeinsurance', '.lifestyle', '.lighting', '.like', '.lilly', '.limited', '.limo', '.lincoln', '.link', '.lipsy', '.live', '.living', '.lk', '.llc', '.llp', '.loan', '.loans', '.locker', '.locus', '.lol', '.london', '.lotte', '.lotto', '.love', '.lpl', '.lplfinancial', '.lr', '.ls', '.lt', '.ltd', '.ltda', '.lu', '.lundbeck', '.luxe', '.luxury', '.lv', '.ly', '.ma', '.madrid', '.maif', '.maison', '.makeup', '.man', '.management', '.mango', '.map', '.market', '.marketing', '.markets', '.marriott', '.marshalls', '.mattel', '.mba', '.mc', '.mckinsey', '.md', '.me', '.med', '.media', '.meet', '.melbourne', '.meme', '.memorial', '.men', '.menu', '.merckmsd', '.mg', '.mh', '.miami', '.microsoft', '.mil', '.mini', '.mint', '.mit', '.mitsubishi', '.mk', '.ml', '.mlb', '.mls', '.mm', '.mma', '.mn', '.mo', '.mobi', '.mobile', '.moda', '.moe', '.moi', '.mom', '.monash', '.money', '.monster', '.mormon', '.mortgage', '.moscow', '.moto', '.motorcycles', '.mov', '.movie', '.mp', '.mq', '.mr', '.ms', '.msd', '.mt', '.mtn', '.mtr', '.mu', '.museum', '.music', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nab', '.nagoya', '.name', '.navy', '.nba', '.nc', '.ne', '.nec', '.net', '.netbank', '.netflix', '.network', '.neustar', '.new', '.news', '.next', '.nextdirect', '.nexus', '.nf', '.nfl', '.ng', '.ngo', '.nhk', '.ni', '.nico', '.nike', '.nikon', '.ninja', '.nissan', '.nissay', '.nl', '.no', '.nokia', '.norton', '.now', '.nowruz', '.nowtv', '.np', '.nr', '.nra', '.nrw', '.ntt', '.nu', '.nyc', '.nz', '.obi', '.observer', '.office', '.okinawa', '.olayan', '.olayangroup', '.ollo', '.om', '.omega', '.one', '.ong', '.onl', '.online', '.ooo', '.open', '.oracle', '.orange', '.org', '.organic', '.origins', '.osaka', '.otsuka', '.ott', '.ovh', '.pa', '.page', '.panasonic', '.paris', '.pars', '.partners', '.parts', '.party', '.pay', '.pccw', '.pe', '.pet', '.pf', '.pfizer', '.pg', '.ph', '.pharmacy', '.phd', '.philips', '.phone', '.photo', '.photography', '.photos', '.physio', '.pics', '.pictet', '.pictures', '.pid', '.pin', '.ping', '.pink', '.pioneer', '.pizza', '.pk', '.pl', '.place', '.play', '.playstation', '.plumbing', '.plus', '.pm', '.pn', '.pnc', '.pohl', '.poker', '.politie', '.porn', '.post', '.pr', '.pramerica', '.praxi', '.press', '.prime', '.pro', '.prod', '.productions', '.prof', '.progressive', '.promo', '.properties', '.property', '.protection', '.pru', '.prudential', '.ps', '.pt', '.pub', '.pw', '.pwc', '.py', '.qa', '.qpon', '.quebec', '.quest', '.racing', '.radio', '.re', '.read', '.realestate', '.realtor', '.realty', '.recipes', '.red', '.redstone', '.redumbrella', '.rehab', '.reise', '.reisen', '.reit', '.reliance', '.ren', '.rent', '.rentals', '.repair', '.report', '.republican', '.rest', '.restaurant', '.review', '.reviews', '.rexroth', '.rich', '.richardli', '.ricoh', '.ril', '.rio', '.rip', '.ro', '.rocks', '.rodeo', '.rogers', '.room', '.rs', '.rsvp', '.ru', '.rugby', '.ruhr', '.run', '.rw', '.rwe', '.ryukyu', '.sa', '.saarland', '.safe', '.safety', '.sakura', '.sale', '.salon', '.samsclub', '.samsung', '.sandvik', '.sandvikcoromant', '.sanofi', '.sap', '.sarl', '.sas', '.save', '.saxo', '.sb', '.sbi', '.sbs', '.sc', '.scb', '.schaeffler', '.schmidt', '.scholarships', '.school', '.schule', '.schwarz', '.science', '.scot', '.sd', '.se', '.search', '.seat', '.secure', '.security', '.seek', '.select', '.sener', '.services', '.seven', '.sew', '.sex', '.sexy', '.sfr', '.sg', '.sh', '.shangrila', '.sharp', '.shell', '.shia', '.shiksha', '.shoes', '.shop', '.shopping', '.shouji', '.show', '.si', '.silk', '.sina', '.singles', '.site', '.sj', '.sk', '.ski', '.skin', '.sky', '.skype', '.sl', '.sling', '.sm', '.smart', '.smile', '.sn', '.sncf', '.so', '.soccer', '.social', '.softbank', '.software', '.sohu', '.solar', '.solutions', '.song', '.sony', '.soy', '.spa', '.space', '.sport', '.spot', '.sr', '.srl', '.ss', '.st', '.stada', '.staples', '.star', '.statebank', '.statefarm', '.stc', '.stcgroup', '.stockholm', '.storage', '.store', '.stream', '.studio', '.study', '.style', '.su', '.sucks', '.supplies', '.supply', '.support', '.surf', '.surgery', '.suzuki', '.sv', '.swatch', '.swiss', '.sx', '.sy', '.sydney', '.systems', '.sz', '.tab', '.taipei', '.talk', '.taobao', '.target', '.tatamotors', '.tatar', '.tattoo', '.tax', '.taxi', '.tc', '.tci', '.td', '.tdk', '.team', '.tech', '.technology', '.tel', '.temasek', '.tennis', '.teva', '.tf', '.tg', '.th', '.thd', '.theater', '.theatre', '.tiaa', '.tickets', '.tienda', '.tips', '.tires', '.tirol', '.tj', '.tjmaxx', '.tjx', '.tk', '.tkmaxx', '.tl', '.tm', '.tmall', '.tn', '.to', '.today', '.tokyo', '.tools', '.top', '.toray', '.toshiba', '.total', '.tours', '.town', '.toyota', '.toys', '.tr', '.trade', '.trading', '.training', '.travel', '.travelers', '.travelersinsurance', '.trust', '.trv', '.tt', '.tube', '.tui', '.tunes', '.tushu', '.tv', '.tvs', '.tw', '.tz', '.ua', '.ubank', '.ubs', '.ug', '.uk', '.unicom', '.university', '.uno', '.uol', '.ups', '.us', '.uy', '.uz', '.va', '.vacations', '.vana', '.vanguard', '.vc', '.ve', '.vegas', '.ventures', '.verisign', '.versicherung', '.vet', '.vg', '.vi', '.viajes', '.video', '.vig', '.viking', '.villas', '.vin', '.vip', '.virgin', '.visa', '.vision', '.viva', '.vivo', '.vlaanderen', '.vn', '.vodka', '.volvo', '.vote', '.voting', '.voto', '.voyage', '.vu', '.wales', '.walmart', '.walter', '.wang', '.wanggou', '.watch', '.watches', '.weather', '.weatherchannel', '.webcam', '.weber', '.website', '.wed', '.wedding', '.weibo', '.weir', '.wf', '.whoswho', '.wien', '.wiki', '.williamhill', '.win', '.windows', '.wine', '.winners', '.wme', '.wolterskluwer', '.woodside', '.work', '.works', '.world', '.wow', '.ws', '.wtc', '.wtf', '.xbox', '.xerox', '.xihuan', '.xin', '.xxx', '.xyz', '.yachts', '.yahoo', '.yamaxun', '.yandex', '.ye', '.yodobashi', '.yoga', '.yokohama', '.you', '.youtube', '.yt', '.yun', '.za', '.zappos', '.zara', '.zero', '.zip', '.zm', '.zone', '.zuerich', '.zw']

    parts = domain.split('.')
    if '.'+parts[-1] in icann_tlds:
        return "Yes"
    else:
        return "No"

def preprocess(filenames):
    df=pd.DataFrame()
    for file in filenames:
        df1=pd.read_csv(file)
        df=pd.concat([df,df1],axis=0)
    df['Domain'] = df['Domain'].apply(lambda x: x[:-1] if x.endswith('.') else x)
    remove_str = ['tradove.com', 'bringwebsite.com', 'prostats.org', 'bcrecdgp.net.in', 'ybnu.net.in']
    df = df[~df['Domain'].str.endswith(tuple(remove_str))]
    df['Valid']=df['Domain'].apply(tld_valid_check)
    df = df[df['Valid']=='Yes']
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
    
def get_filename(timestring,prefix='phish'):
    return prefix+'-'+timestring.replace('.','-').replace(' ','-')

# def main(date_time):
def main():
    esClient = create_esConnection()
    # print(esClient.info)
    time_format = "%d.%m.%Y %H:%M:%S"
    #max_rows_per_file = 1000000
    max_rows_per_file = 100000
    time_range = [
        ['04.02.2026 09:20:00','09.02.2026 11:10:00']
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
                        
                        { "term": {"@type.keyword": "TypoSquat" } },
                        { "term": { "Category.keyword": "Phishing" } },
                        { "term": { "appId_typo": 443 } }
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
                obj['@timestamp'] = source.get('@timestamp')
                obj['Domain'] = source.get('domainName_SSlServerName')
                obj['SourceIP'] = source.get('SourceIP')
                obj['SrcPort'] = source.get('SrcPort')
                obj['DstIP'] = source.get('DstIP')
                obj['DstPort'] = source.get('DstPort')             
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
    final_df = preprocess(filename_list)
    final_df.to_csv("phish.csv",index=False)


