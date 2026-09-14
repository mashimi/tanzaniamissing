import { writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const [name, region, lat, lng, date] = process.argv.slice(2);
if (!name || !region || !lat || !lng || !date) {
  console.log('Usage: npm run new:record -- "Full Name" "Dar es Salaam" -6.82 39.28 2025-06-01');
  process.exit(1);
}
const slug = name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const existing = (await readdir("records")).filter(f => /^\d{4}-/.test(f));
const n = String(existing.length + 1).padStart(4, "0");
const id = `${n}-${slug}`;

const record = {
  id, full_name: name, age: null, gender: "unknown", photo_path: "",
  last_seen_date: date,
  location: { name: "", latitude: parseFloat(lat), longitude: parseFloat(lng), region, district: "" },
  status: "missing", circumstances: "", tags: [], verified: false, sources: [],
  is_public: true, created_at: new Date().toISOString(),
};

await writeFile(path.join("records", `${id}.json`), JSON.stringify(record, null, 2));
console.log(`✅ records/${id}.json — fill in details, add ≥2 sources, set verified:true, open a PR.`);
