import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start'); // Expects "YYYY-MM-DDTHH:MM"
  const end = searchParams.get('end');     // Expects "YYYY-MM-DDTHH:MM"
  const days = searchParams.get('days');

  /**
   * Converts "YYYY-MM-DDTHH:MM" (from datetime-local) 
   * to "DD.MM.YYYY HH:MM:SS" (for Python script)
   */
  const convertFormat = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";
    const [datePart, timePart] = dateTimeStr.split("T");
    const [y, m, d] = datePart.split("-");
    // Adding :00 for seconds to match Python format strictly
    return `${d}.${m}.${y} ${timePart}:00`;
  };

  let finalStart = "";
  let finalEnd = "";

  if (days) {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - parseInt(days));
    
    const fmt = (d: Date) => 
      `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
    
    finalStart = fmt(past);
    finalEnd = fmt(now);
  } else if (start && end) {
    finalStart = convertFormat(start);
    finalEnd = convertFormat(end);
  }

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'anomaly_pull_data_from_elastic.py');
    const csvPath = path.join(process.cwd(), 'anomaly.csv');

    if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);

    // Pass the formatted strings as arguments to Python
    const pythonProcess = spawn('python3', [scriptPath, finalStart, finalEnd]);

    let errorData = "";
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(csvPath)) {
        const csvData = fs.readFileSync(csvPath, 'utf8');
        resolve(new NextResponse(csvData, { 
          status: 200,
          headers: { 'Content-Type': 'text/csv' } 
        }));
      } else {
        console.error("Python Error:", errorData);
        resolve(NextResponse.json({ error: "Script failed", details: errorData }, { status: 500 }));
      }
    });
  });
}