import { readFile } from "fs/promises";
import path from "path";
import Papa from "papaparse";

export async function parseCSV(filename: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), "public", filename);
  const file = await readFile(filePath, "utf8");

  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
    });
  });
}
