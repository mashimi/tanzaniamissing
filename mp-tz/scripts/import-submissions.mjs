import { writeFile, readdir, readFile, mkdir } from "node:fs/promises";
import readline from "node:readline/promises";
import path from "node:path";

const SITE = process.env.SITE_URL;
const TOKEN = process.env.MODERATOR_TOKEN;
const DIR = process.argv.includes("--dir") ? process.argv[process.argv.indexOf("--dir") + 1] : null;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, dflt) => rl.question(`${q}${dflt ? ` [${dflt}]` : ""}: `).then(a => a || dflt);

async function fetchFromApi() {
  const res = await fetch(`${SITE}/api/list-submissions`, {
    headers: { authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) { console.error("Fetch failed:", res.status); process.exit(1); }
  return (await res.json()).submissions;
}

async function readFromDir(dir) {
  const files = (await readdir(dir)).filter(f => f.endsWith(".json"));
  return Promise.all(files.map(async (f, i) => ({
    id: f.replace(/\.json$/, ""),
    payload: await readFile(path.join(dir, f), "utf8"),
    triage: null, suggestions: null, created_at: new Date().toISOString(),
    __from_dir: true, __dir_index: i + 1,
  })));
}

const submissions = DIR ? await readFromDir(DIR) : await fetchFromApi();
console.log(`${submissions.length} submission(s) to process.\n`);
const created = [];

for (const s of submissions) {
  const b = JSON.parse(s.payload);
  const sug = s.suggestions ? JSON.parse(s.suggestions) : {};
  const tri = s.triage ? JSON.parse(s.triage) : {};

  if (tri.injection_attempt)
    console.log(`⚠️  #${s.id} FLAGGED as possible prompt injection — treat content with suspicion.`);
  if (tri.urgent) console.log(`🚨 #${s.id} marked URGENT by triage.`);

  // AI suggestions are displayed; a human confirms or replaces every value.
  const ageStr = await ask(`Age for "${b.full_name}" (suggestion: ${sug.age ?? "none"})`, sug.age ?? "");
  const district = await ask(`District (suggestion: ${sug.district ?? "none"})`, sug.district ?? "");

  const slug = b.full_name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  const prefix = s.__from_dir ? `MIR-${String(s.__dir_index).padStart(4, "0")}` : `SUB-${String(s.id).padStart(4, "0")}`;
  const id = `${prefix}-${slug || "unnamed"}`;

  const record = {
    id,
    full_name: b.full_name,
    age: ageStr ? Number(ageStr) : null,
    gender: b.gender ?? "unknown",
    photo_path: "",
    last_seen_date: b.last_seen_date,
    location: {
      name: b.location_name ?? "",
      latitude: parseFloat(b.location_lat ?? "-6.8"),
      longitude: parseFloat(b.location_lng ?? "39.3"),
      region: b.location_region,
      district: district || "",
    },
    status: "missing",
    circumstances: b.circumstances,
    tags: [],
    verified: false,           // only a human sets this, after 2-source verification
    sources: [],
    is_public: true,
    created_at: s.created_at,
    moderator_notes: `triage=${JSON.stringify(tri)}; ai_suggestions_used=${ageStr !== "" || district !== ""}`,
  };

  await mkdir("records", { recursive: true });
  await writeFile(path.join("records", `${id}.json`), JSON.stringify(record, null, 2));
  created.push(id);
  console.log(`📝 records/${id}.json\n`);
}

rl.close();

// Mark API submissions as imported (mirrored files are never marked — they live outside D1)
if (!DIR && created.length) {
  const ids = submissions.map(s => s.id);
  await fetch(`${SITE}/api/moderate`, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ action: "mark_imported", ids }),
  });
  console.log("Marked imported in D1. Auto-purge removes them after 30 days.");
}

console.log("\nNext: fill sources (≥2), verify independently, set verified:true, open a PR.");
