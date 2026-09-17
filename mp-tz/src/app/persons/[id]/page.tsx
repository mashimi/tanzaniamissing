import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonDetail from "@/components/PersonDetail";
import { getAllPersons, getPerson } from "@/lib/records";

const SITE_URL = "https://www.tanzania.qd.je";

export function generateStaticParams() {
  return getAllPersons().map(p => ({ id: p.id }));
}

function abs(u?: string): string | undefined {
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : new URL(u, SITE_URL).toString();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = getPerson(params.id);
  if (!p) return { title: "Not found" };

  const statusWord =
    p.status === "missing" ? "missing" :
    p.status === "found_alive" ? "found alive" :
    p.status === "found_deceased" ? "found deceased" : "missing";

  const place = p.location ? ` in ${p.location.region}` : "";
  const fallbackDescription = `${p.full_name}, ${statusWord} since ${p.last_seen_date}${place}, Tanzania.`;
  const description = p.circumstances
    ? (p.circumstances.length > 155 ? p.circumstances.slice(0, 152) + "..." : p.circumstances)
    : fallbackDescription;
  const image = abs(p.photo_path);

  return {
    title: `${p.full_name} — ${statusWord} since ${p.last_seen_date}`,
    description,
    alternates: { canonical: `/persons/${p.id}/` },
    openGraph: {
      type: "profile",
      title: `${p.full_name} — ${statusWord} since ${p.last_seen_date}`,
      description,
      url: `/persons/${p.id}/`,
      images: image ? [{ url: image, alt: p.full_name }] : undefined,
      locale: "sw_KE",
      alternateLocale: ["en_US"],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${p.full_name} — ${statusWord}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const p = getPerson(params.id);
  if (!p) notFound();

  const statusWord =
    p.status === "missing" ? "missing" :
    p.status === "found_alive" ? "found alive" :
    p.status === "found_deceased" ? "found deceased" : "missing";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/persons/${p.id}/#person`,
        name: p.full_name,
        url: `${SITE_URL}/persons/${p.id}/`,
        identifier: p.id,
        gender: p.gender,
        description: p.circumstances || `${p.full_name}, ${statusWord} since ${p.last_seen_date}.`,
        ...(p.photo_path ? { image: abs(p.photo_path) } : {}),
        ...(p.location ? {
          homeLocation: {
            "@type": "Place",
            name: p.location.name,
            address: {
              "@type": "PostalAddress",
              addressRegion: p.location.region,
              addressCountry: "TZ",
            },
          },
        } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/persons/${p.id}/#webpage`,
        url: `${SITE_URL}/persons/${p.id}/`,
        name: `${p.full_name} — ${statusWord} since ${p.last_seen_date} | Tanzania Missing Persons Registry`,
        inLanguage: ["sw", "en"],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/persons/${p.id}/#person` },
        ...(p.sources?.length ? { citation: p.sources } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: p.full_name, item: `${SITE_URL}/persons/${p.id}/` },
        ],
      },
    ],
  };

  return (
    <>
      <PersonDetail p={p} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
