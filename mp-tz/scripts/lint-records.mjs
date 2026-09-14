import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";

const TZ = { latMin: -11.8, latMax: -0.9, lngMin: 29.2, lngMax: 40.6 };
const errors = [], warnings = [];
const files = (await readdir("records")).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const seen = new Map();

for (const f of files) {
  const p = JSON.parse(await readFile(path.join("records", f), "utf8"));
  if (!f.startsWith(p.id)) errors.push(`${f}: id "${p.id}" doesn't match filename`);

  const key = p.full_name.toLowerCase().replace(/\s+/g, "");
  if (seen.has(key)) errors.push(`${f}: possible duplicate of ${seen.get(key)} (same name)`);
  seen.set(key, f);

  // The core invariant: verification requires evidence
  if (p.verified && (p.sources?.length ?? 0) < 2)
    errors.push(`${f}: verified=true requires ≥2 sources`);

  if (p.photo_path) {
    if (/^https?:\/\//i.test(p.photo_path)) {
      if (!p.photo_path.startsWith("https://"))
        errors.push(`${f}: remote photo must be https://`);
    } else {
      try { await access(path.join("public", p.photo_path)); }
      catch { errors.push(`${f}: local photo missing at public${p.photo_path}`); }
    }
  }

  const { latitude: la, longitude: lo } = p.location;
  if (la < TZ.latMin || la > TZ.latMax || lo < TZ.lngMin || lo > TZ.lngMax)
    warnings.push(`${f}: coords outside Tanzania — check for swapped lat/lng`);
  if (Number.isNaN(Date.parse(p.last_seen_date))) errors.push(`${f}: bad date`);
  if (p.last_seen_date > new Date().toISOString().slice(0, 10))
    errors.push(`${f}: last_seen_date is in the future`);
}

errors.forEach(e => console.error("❌", e));
warnings.forEach(w => console.warn("⚠️ ", w));
if (errors.length) process.exit(1);
console.log(`✅ lint passed (${files.length} records)`);
