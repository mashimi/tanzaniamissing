import Link from "next/link";
import Photo from "./Photo";
import type { Person } from "@/lib/types";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  missing:          { bg: "bg-red-950/60 border-red-900",    text: "text-red-400",   label: "Missing" },
  found_alive:      { bg: "bg-green-950/60 border-green-900", text: "text-green-400", label: "Found alive" },
  found_deceased:   { bg: "bg-gray-900 border-gray-800",     text: "text-gray-400",  label: "Found deceased" },
  unknown:          { bg: "bg-yellow-950/60 border-yellow-900", text: "text-yellow-400", label: "Unknown" },
};

export default function PersonDetail({ p }: { p: Person }) {
  const initials = p.full_name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const st = statusStyles[p.status] ?? statusStyles.unknown;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Back bar */}
      <div className="border-b border-gray-800 bg-gray-950/80">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to registry
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <div className="shrink-0">
            {p.photo_path ? (
              <Photo
                src={p.photo_path}
                alt={p.full_name}
                className="w-44 h-44 md:w-52 md:h-52 object-cover rounded-2xl border border-gray-800 shadow-xl"
              />
            ) : (
              <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 flex items-center justify-center text-6xl text-gray-600 font-black select-none shadow-xl">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{p.full_name}</h1>
              <p className="text-gray-400 mt-1 text-sm">
                {p.age ? `${p.age} years old` : "Age unknown"} · {p.gender}
              </p>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${st.bg} ${st.text}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {st.label}
              {!p.verified && (
                <span className="ml-1 text-[10px] bg-yellow-800/60 text-yellow-400 border border-yellow-700/50 px-1.5 py-0.5 rounded-full font-normal">
                  unverified
                </span>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Last seen</p>
                <p className="text-white font-semibold">{p.last_seen_date}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Location</p>
                <p className="text-white font-semibold text-sm">
                  {[p.location.name, p.location.district, p.location.region]
                    .filter(Boolean).join(", ") || "Unknown"}
                </p>
              </div>
            </div>

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-1">
                {p.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded-full text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Circumstances */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-3 text-gray-200">Circumstances</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
              {p.circumstances || "No circumstances recorded."}
            </p>
          </div>
        </section>

        {/* Sources */}
        {p.sources.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3 text-gray-200">Sources</h2>
            <ul className="space-y-2">
              {p.sources.map((src, i) => (
                <li key={i} className="text-sm text-gray-400">
                  {src.startsWith("http") ? (
                    <a href={src} target="_blank" rel="noopener noreferrer"
                      className="text-red-400 hover:underline break-all">{src}</a>
                  ) : src}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tip callout */}
        <section className="mt-10 p-5 bg-yellow-950/30 border border-yellow-900/50 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-xl mt-0.5">💡</span>
            <div>
              <h3 className="font-semibold text-yellow-400 text-sm">Have information about this case?</h3>
              <p className="text-gray-400 text-sm mt-1">
                Report where and when you saw this person. Your identity will be protected.{" "}
                <Link
                  href={`/submit/?about=${encodeURIComponent(p.full_name)}&id=${encodeURIComponent(p.id)}`}
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Report anonymously →
                </Link>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Prefer to talk to a person? Message the team directly on Signal:{" "}
                <a href="https://signal.me/#p/+[REDACTED]" target="_blank" rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline font-medium whitespace-nowrap">
                  +49 1768 2648029
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
