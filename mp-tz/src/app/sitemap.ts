import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.tanzania.qd.je";

interface CaseRecord {
  id: string;
  created_at?: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dir = path.join(process.cwd(), "records");
  const records: CaseRecord[] = fs
    .readdirSync(dir)
    .filter(f => f.endsWith(".json") && !f.startsWith("_"))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as CaseRecord);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/submit/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const casePages: MetadataRoute.Sitemap = records.map(r => ({
    url: `${BASE}/persons/${r.id}/`,
    lastModified: r.created_at ? new Date(r.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...casePages];
}
