CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  payload     TEXT NOT NULL,
  triage      TEXT,
  suggestions TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
  ip_hash     TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sub_status ON submissions (status, created_at);
CREATE INDEX IF NOT EXISTS idx_sub_iphash ON submissions (ip_hash, created_at);

-- Published cases (created by moderator "approve & publish" action)
CREATE TABLE IF NOT EXISTS cases (
  id           TEXT PRIMARY KEY,
  data         TEXT NOT NULL,
  published_at TEXT NOT NULL DEFAULT (datetime('now'))
);
