"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-900 text-white border border-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-sm placeholder-gray-600";
const labelClass = "block text-sm text-gray-400 mt-5 mb-1.5 font-medium";

export default function Submit() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950" />
    }>
      <SubmitForm />
    </Suspense>
  );
}

function SubmitForm() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const searchParams = useSearchParams();
  const tipAbout = searchParams.get("about") ?? "";
  const tipCaseId = searchParams.get("id") ?? "";
  const isTip = Boolean(tipAbout);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("website")) return; // honeypot
    setState("sending");
    try {
      const body: Record<string, unknown> = Object.fromEntries(form.entries());
      body.consent = form.get("consent") === "on";
      delete body.website;
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-4 bg-gray-950">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-green-900/40 border border-green-800 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Report Received</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{t("submit.success")}</p>
          <a href="/" className="inline-block mt-6 text-red-400 hover:text-red-300 text-sm transition-colors">
            ← Back to registry
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">{t("submit.heading")}</h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">{t("submit.intro")}</p>
        </div>

        {/* Safety notice */}
        <div className="flex gap-3 p-4 bg-yellow-950/30 border border-yellow-900/50 rounded-xl mb-6">
          <span className="text-yellow-400 text-lg shrink-0 mt-0.5">⚠️</span>
          <p className="text-yellow-200 text-sm leading-relaxed">
            {t("submit.signal_note")}{" "}
            <a href="/api/signal" target="_blank" rel="noopener noreferrer"
              className="text-yellow-400 hover:underline font-medium">
              Signal →
            </a>
          </p>
        </div>

        {/* Sighting-tip context banner */}
        {isTip && (
          <div className="flex gap-3 p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl mb-6">
            <span className="text-blue-400 text-lg shrink-0 mt-0.5">👁️</span>
            <p className="text-blue-200 text-sm leading-relaxed">
              {t("submit.tip_banner")} <strong className="text-white">{tipAbout}</strong>
              {tipCaseId && <span className="text-blue-400/70 text-xs block mt-0.5">Case {tipCaseId}</span>}
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="flex gap-3 p-4 bg-red-950/40 border border-red-900/50 rounded-xl mb-6">
            <span className="text-red-400 text-lg shrink-0">✕</span>
            <p className="text-red-300 text-sm">{t("submit.error")}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-1">
          {/* Honeypot — hidden from humans, visible to bots */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
            className="hidden" aria-hidden="true" />

          {/* Personal info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Person Details
            </h2>

            <label className={labelClass}>{t("submit.name_label")} *</label>
            <input required name="full_name" className={inputClass} placeholder="e.g. Amina Hassan"
              defaultValue={tipAbout} readOnly={isTip} />
            {tipCaseId && <input type="hidden" name="tip_case_id" value={tipCaseId} />}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("submit.age_label")}</label>
                <input name="age" type="number" min={0} max={120} className={inputClass} placeholder="35" />
              </div>
              <div>
                <label className={labelClass}>{t("submit.gender_label")}</label>
                <select name="gender" className={inputClass} defaultValue="unknown">
                  <option value="unknown">Unknown</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & date */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              When & Where
            </h2>

            <label className={labelClass}>{t("submit.date_label")} *</label>
            <input required name="last_seen_date" type="date" className={inputClass} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("submit.region_label")} *</label>
                <input required name="location_region" className={inputClass} placeholder="Dar es Salaam" />
              </div>
              <div>
                <label className={labelClass}>{t("submit.district_label")}</label>
                <input name="location_district" className={inputClass} placeholder="Ilala" />
              </div>
            </div>

            <label className={labelClass}>{t("submit.location_label")}</label>
            <input name="location_name" className={inputClass} placeholder="Kariakoo Market" />
          </div>

          {/* Circumstances */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              What Happened
            </h2>

            <label className={labelClass}>{isTip ? t("submit.tip_circumstances_label") : t("submit.circumstances_label")} *</label>
            <textarea
              required name="circumstances" rows={6} className={inputClass}
              placeholder={isTip ? t("submit.tip_placeholder") : "Describe the circumstances in as much detail as you know…"}
            />
          </div>

          {/* Photo & Media */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Photo / Picha
            </h2>
            <label className={labelClass}>{t("submit.photo_label")}</label>
            <input name="photo_path" className={inputClass} placeholder="https://example.com/photo.jpg or /photos/person.jpg" />
            <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
              Both remote HTTP/HTTPS image URL links and local repository photo paths are supported. External URLs are proxied securely via server edge so visitor IP addresses are never exposed to remote image hosts.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Your Contact (Optional)
            </h2>
            <label className={labelClass}>{t("submit.contact_label")}</label>
            <input name="contact" className={inputClass} placeholder="Signal number or email — optional" />
            <p className="text-gray-600 text-xs mt-2">
              Your contact information will never be published and is only used for follow-up if needed.
            </p>
          </div>

          {/* Consent + submit */}
          <div className="pt-4">
            <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer group">
              <input required type="checkbox" name="consent"
                className="mt-0.5 w-4 h-4 rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500" />
              <span className="leading-relaxed">{t("submit.consent_label")}</span>
            </label>

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-6 w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              {state === "sending" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {t("submit.sending")}
                </span>
              ) : t("submit.send")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
