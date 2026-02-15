import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start'); 
  const end = searchParams.get('end');     
  const days = searchParams.get('days');

  const formatDateForPython = (dateStr: string, isEndOfDay: boolean = false) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const p = (n: number) => String(n).padStart(2, '0');

    const datePart = `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
    // If UI doesn't provide seconds, we force :00 for start and :59 for end to cover the full range
    const timePart = `${p(d.getHours())}:${p(d.getMinutes())}:${isEndOfDay ? '59' : '00'}`;
    
    return `${datePart} ${timePart}`;
  };

  let finalStart = "";
  let finalEnd = "";

  if (days) {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - parseInt(days));
    finalStart = formatDateForPython(past.toISOString());
    finalEnd = formatDateForPython(now.toISOString(), true);
  } else if (start && end) {
    finalStart = formatDateForPython(start);
    finalEnd = formatDateForPython(end, true);
  }

  if (!finalStart || !finalEnd) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'tor_pull_data_from_elastic.py');
    const csvPath = path.join(process.cwd(), 'tor.csv');

    // Clean old file
    if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);

    const pythonProcess = spawn('python3', [scriptPath, finalStart, finalEnd]);

    let stderrData = "";
    pythonProcess.stderr.on('data', (data) => { stderrData += data.toString(); });

    pythonProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(csvPath)) {
        const csvData = fs.readFileSync(csvPath, 'utf8');
        resolve(new NextResponse(csvData, { 
          status: 200,
          headers: { 'Content-Type': 'text/csv' } 
        }));
      } else {
        resolve(NextResponse.json({ error: "Python Error", details: stderrData }, { status: 500 }));
      }
    });
  });
}