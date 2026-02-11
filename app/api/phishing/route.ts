import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start'); // e.g., "2026-02-09"
  const end = searchParams.get('end');     // e.g., "2026-02-09"
  const days = searchParams.get('days');

  // Helper to convert "YYYY-MM-DD" to "DD.MM.YYYY HH:MM:SS"
  const convertFormat = (dateStr: string, time: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y} ${time}`;
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
    finalStart = convertFormat(start, "00:00:00");
    finalEnd = convertFormat(end, "23:59:59");
  }

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'phishing_pull_data_from_elastic.py');
    const csvPath = path.join(process.cwd(), 'phish.csv');

    // Remove old CSV if it exists to ensure fresh data
    if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);

    // Spawn Python Process
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