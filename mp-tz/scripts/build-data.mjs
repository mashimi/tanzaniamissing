import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const RECORDS_DIR = path.resolve("records");
const OUT_FILE = path.resolve("public/data/persons.json");
const STATUSES = new Set(["missing", "found_alive", "found_deceased", "unknown"]);

function fail(file, msg) {
  console.error(`❌ ${file}: ${msg}`);
  process.exit(1);
}

const files = (await readdir(RECORDS_DIR)).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const persons = [];

for (const f of files) {
  const p = JSON.parse(await readFile(path.join(RECORDS_DIR, f), "utf8"));

  for (const k of ["id", "full_name", "last_seen_date", "status", "location"])
    if (!p[k]) fail(f, `missing required field "${k}"`);
  if (!STATUSES.has(p.status)) fail(f, `invalid status "${p.status}"`);
  if (!p.is_public) continue; // consent withdrawn → never ships

  // Privacy: fuzz coordinates to 2 decimals (~1.1 km) before publishing
  p.location.latitude = Math.round(p.location.latitude * 100) / 100;
  p.location.longitude = Math.round(p.location.longitude * 100) / 100;

  p.circumstances ??= "";
  p.tags ??= [];
  delete p.moderator_notes; // internal field never becomes public
  persons.push(p);
}

const ids = new Set(persons.map(p => p.id));
if (ids.size !== persons.length) fail("records/", "duplicate person ids found");

persons.sort((a, b) => b.last_seen_date.localeCompare(a.last_seen_date));
await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(persons, null, 2));
console.log(`✅ ${persons.length} records → public/data/persons.json`);
