import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonDetail from "@/components/PersonDetail";
import { getAllPersons, getPerson } from "@/lib/records";

export function generateStaticParams() {
  return getAllPersons().map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = getPerson(params.id);
  return {
    title: p ? `${p.full_name} — Rejista ya Watu Waliopotea` : "Not found",
    description: p ? `${p.full_name}, last seen ${p.last_seen_date} in ${p.location.region}, Tanzania.` : undefined,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const p = getPerson(params.id);
  if (!p) notFound();
  return <PersonDetail p={p} />;
}
