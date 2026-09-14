"use client";
import { useCallback, useEffect, useState } from "react";

type Submission = {
  id: number;
  payload: string;
  triage: string | null;
  suggestions: string | null;
  created_at: string;
};

type Triage = { urgent?: boolean; injection_attempt?: boolean; spammy?: boolean };
type Suggestions = { age?: number | null; district?: string; date_iso?: string | null; urgency?: string };

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-900 text-white border border-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-sm placeholder-gray-600";

function safeParse<T>(s: string | null): Partial<T> {
  if (!s) return {};
  try { return JSON.parse(s); } catch { return {}; }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
      <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{value}</p>
    </div>
  );
}

export default function Moderate() {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setToken(sessionStorage.getItem("moderator_token"));
    setChecking(false);
  }, []);

  const load = useCallback(async (t: string) => {
    setLoadError(null);
    const res = await fetch("/api/list-submissions", {
      headers: { authorization: `Bearer ${t}` },
    });
    if (res.status === 401) {
      sessionStorage.removeItem("moderator_token");
      setToken(null);
      setAuthError("Invalid or missing moderator token.");
      return;
    }
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    setSubmissions(data.submissions);
    setSelected(new Set());
  }, []);

  useEffect(() => {
    if (token) load(token).catch(() => setLoadError("Could not reach the API."));
  }, [token, load]);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const t = (new FormData(e.currentTarget).get("token") as string ?? "").trim();
    if (!t) return;
    setAuthError(null);
    const res = await fetch("/api/list-submissions", {
      headers: { authorization: `Bearer ${t}` },
    });
    if (res.status === 401) {
      setAuthError("Invalid token.");
      return;
    }
    if (!res.ok) {
      setAuthError("API error — check deployment and D1 binding.");
      return;
    }
    sessionStorage.setItem("moderator_token", t);
    setToken(t);
  }

  async function act(action: "publish" | "reject") {
    if (!token || selected.size === 0) return;
    if (action === "reject" && !confirm(`Reject ${selected.size} submission(s)? This hides them permanently.`)) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setNotice(action === "publish"
        ? `Published ${data.published.length} case(s) to the public registry. Verify sources later via the records flow.`
        : `Rejected ${data.rejected} submission(s).`);
      await load(token);
    } catch {
      setNotice("Action failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  if (checking) return null;

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-2xl font-bold text-white mb-1">Moderation Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">Restricted area — moderators only.</p>
        <form onSubmit={onLogin} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm text-gray-400 mb-1.5 font-medium">Moderator token</label>
            <input id="token" name="token" type="password" required autoFocus
              className={inputClass} placeholder="MODERATOR_TOKEN" autoComplete="current-password" />
          </div>
          {authError && <p className="text-red-400 text-sm">{authError}</p>}
          <button type="submit"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Submissions</h1>
          <p className="text-gray-500 text-sm">
            {submissions === null ? "Loading…" : `${submissions.length} awaiting review`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => token && load(token).catch(() => setLoadError("Could not reach the API."))}
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition-colors">
            Refresh
          </button>
          <button onClick={() => { sessionStorage.removeItem("moderator_token"); setToken(null); setSubmissions(null); }}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {loadError && <p className="text-red-400 text-sm mb-4">{loadError}</p>}
      {notice && <p className="text-green-400 text-sm mb-4">{notice}</p>}

      {submissions !== null && submissions.length > 0 && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => act("publish")} disabled={busy || selected.size === 0}
            className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-semibold text-sm transition-colors">
            Approve &amp; publish selected ({selected.size})
          </button>
          <button onClick={() => act("reject")} disabled={busy || selected.size === 0}
            className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors">
            Reject selected
          </button>
        </div>
      )}

      {submissions !== null && submissions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">✓</p>
          <p>No pending submissions. All caught up.</p>
        </div>
      )}

      <div className="space-y-4">
        {submissions?.map(s => {
          const b = safeParse<Record<string, string>>(s.payload);
          const tri = safeParse<Triage>(s.triage);
          const sug = safeParse<Suggestions>(s.suggestions);
          return (
            <div key={s.id}
              className={`bg-gray-900 border rounded-xl p-5 ${selected.has(s.id) ? "border-red-600" : "border-gray-800"}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)}
                  className="mt-1.5 w-4 h-4 accent-red-600 shrink-0" aria-label={`Select submission #${s.id}`} />
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{b.full_name ?? `Submission #${s.id}`}</span>
                    <span className="text-gray-600 text-xs">#{s.id}</span>
                    <span className="text-gray-600 text-xs">{s.created_at}</span>
                    {tri.urgent && <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-semibold">URGENT</span>}
                    {tri.injection_attempt && <span className="px-2 py-0.5 rounded-full bg-yellow-950 border border-yellow-800 text-yellow-300 text-xs font-semibold">INJECTION FLAG</span>}
                    {tri.spammy && <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs">SPAMMY</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Gender" value={b.gender} />
                    <Field label="Last seen" value={b.last_seen_date} />
                    <Field label="Region" value={b.location_region} />
                    <Field label="Location" value={b.location_name} />
                    <Field label="Contact" value={b.contact} />
                    <Field label="Reporter" value={b.reporter_name} />
                  </div>
                  <Field label="Circumstances" value={b.circumstances} />
                  {(sug.age || sug.district || sug.urgency) && (
                    <div className="text-xs text-gray-500 border-t border-gray-800 pt-2">
                      AI suggestions — age: {sug.age ?? "—"} · district: {sug.district ?? "—"} · urgency: {sug.urgency ?? "—"}
                      {sug.date_iso ? ` · date: ${sug.date_iso}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
