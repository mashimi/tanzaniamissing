import fs from "node:fs";
import path from "node:path";
import type { Person } from "./types";

const RECORDS_DIR = path.join(process.cwd(), "records");

export function getAllPersons(): Person[] {
  const files = fs.readdirSync(RECORDS_DIR)
    .filter(f => f.endsWith(".json") && !f.startsWith("_"));
  return files
    .map(f => JSON.parse(fs.readFileSync(path.join(RECORDS_DIR, f), "utf8")) as Person)
    .filter(p => p.is_public !== false)
    .sort((a, b) => b.last_seen_date.localeCompare(a.last_seen_date));
}

export function getPerson(id: string): Person | undefined {
  return getAllPersons().find(p => p.id === id);
}
