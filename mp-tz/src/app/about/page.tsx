"use client";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

// English FAQ constant — also used as structured data (FAQPage) so AI
// systems always get consistent answer text regardless of UI language.
const FAQ = [
  {
    q: "How do I report a missing person or a sighting?",
    a: "Use the report form on this site. It is anonymous — no name or account is required — and a moderator reviews every submission before anything is published. If you are at risk, send a tip on Signal instead.",
  },
  {
    q: "Is submitting a report completely anonymous?",
    a: "Yes. The form requires no name, email or account, we never publish the identity of a submitter, and identifying details are removed from report text before publication.",
  },
  {
    q: "How are cases verified?",
    a: "A case is marked verified only with at least two independent sources, or direct confirmation from the family. Unverified cases are labelled as such, and families can request corrections or removal at any time.",
  },
  {
    q: "What is an enforced disappearance?",
    a: "It is when someone is taken or detained and the authorities refuse to acknowledge it or reveal their fate or whereabouts. Under international law it is one of the most serious human-rights violations.",
  },
  {
    q: "Can I mirror or reuse this data?",
    a: "Yes. All case records are open JSON files published in a public repository under CC BY-NC 4.0. Fork it and serve the static build from any static host — every mirror strengthens the record.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

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
          </section>
        ))}
      </div>

      <section className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-red-400 mb-4">
          {t("about.faq_title")}
        </h2>
        <div className="space-y-5">
          {FAQ.map((f, i) => (
            <div key={i}>
              <h3 className="text-gray-100 font-semibold text-sm mb-1.5">
                {f.q}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/submit/"
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {t("nav.submit")}
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
