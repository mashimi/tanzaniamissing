"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PersonDetail from "@/components/PersonDetail";
import type { Person } from "@/lib/types";

function ViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [person, setPerson] = useState<Person | null | "error">(null);

  useEffect(() => {
    if (!id) return;
    fetch("/api/cases")
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        const found = (d.cases as Person[]).find(c => c.id === id) ?? null;
        setPerson(found);
      })
      .catch(() => setPerson("error"));
  }, [id]);

  if (person === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-sm">
        Loading case…
      </div>
    );
  }

  if (person === "error" || !person) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg font-semibold text-gray-400">Case not found</p>
        <p className="text-gray-600 text-sm mt-1">It may have been removed from the registry.</p>
        <Link href="/" className="mt-6 text-red-400 hover:text-red-300 text-sm transition-colors">
          ← Back to registry
        </Link>
      </div>
    );
  }

  return <PersonDetail p={person} />;
}

export default function PersonView() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-sm">
        Loading case…
      </div>
    }>
      <ViewInner />
    </Suspense>
  );
}
