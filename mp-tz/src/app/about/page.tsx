"use client";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

const REPO_URL = "https://github.com/mashimi/tanzaniamissing";

export default function AboutPage() {
  const { t } = useI18n();

  const sections = [
    {
      icon: "✊",
      title: t("about.why_title"),
      body: [t("about.why")],
    },
    {
      icon: "🗄️",
      title: t("about.survives_title"),
      body: [t("about.survives_1"), t("about.survives_2")],
    },
    {
      icon: "🛡️",
      title: t("about.protection_title"),
      body: [t("about.protection_1"), t("about.protection_2")],
      signalLink: true,
    },
    {
      icon: "✔️",
      title: t("about.verification_title"),
      body: [t("about.verification")],
    },
    {
      icon: "🧩",
      title: t("about.mirror_title"),
      body: [t("about.mirror")],
      repoLink: true,
    },
    {
      icon: "⚠️",
      title: t("about.safety_title"),
      body: [t("about.safety")],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
        {t("about.heading")}
      </h1>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <section
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-red-400 mb-3">
              <span aria-hidden="true">{s.icon}</span>
              {s.title}
            </h2>
            {s.body.map((paragraph, j) => (
              <p
                key={j}
                className="text-gray-300 text-sm leading-relaxed mb-2 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            {s.signalLink && (
              <a
                href="/api/signal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
              >
                {t("about.protection_signal")}
              </a>
            )}
            {s.repoLink && (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                {t("about.repo_link")}
              </a>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/submit/"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {t("nav.submit")}
        </Link>
      </div>
    </div>
  );
}
