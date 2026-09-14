"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PersonCard from "./PersonCard";
import SearchBar from "./SearchBar";
import { useI18n } from "@/i18n/I18nProvider";
import type { Person } from "@/lib/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] animate-pulse bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
      <span className="text-gray-600 text-sm">Loading map…</span>
    </div>
  ),
});

const statusCounts = (persons: Person[]) => ({
  missing: persons.filter(p => p.status === "missing").length,
  found_alive: persons.filter(p => p.status === "found_alive").length,
  found_deceased: persons.filter(p => p.status === "found_deceased").length,
});

export default function Registry({ initial }: { initial: Person[] }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [persons, setPersons] = useState<Person[]>(initial);

  // Live-merge cases published from the moderation dashboard (D1-backed).
  // Static records stay first-class; D1 cases link to the client-side view.
  const staticIds = useMemo(() => new Set(initial.map(p => p.id)), [initial]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cases")
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        if (cancelled || !Array.isArray(d.cases) || d.cases.length === 0) return;
        setPersons(prev => {
          const ids = new Set(prev.map(p => p.id));
          const fresh = (d.cases as Person[]).filter(c => !ids.has(c.id));
          if (fresh.length === 0) return prev;
          return [...prev, ...fresh].sort((a, b) => b.last_seen_date.localeCompare(a.last_seen_date));
        });
      })
      .catch(() => {}); // registry works offline from static data if the API is unreachable
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return persons.filter(p => {
      const matchesSearch = !q || [p.full_name, p.location.region, p.location.district, p.circumstances, ...p.tags]
        .join(" ").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [persons, search, statusFilter]);

  const counts = statusCounts(persons);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative text-center py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-900/50 rounded-full px-4 py-1.5 text-red-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {persons.length} {t("home.registry_title")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t("home.heading")}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            {t("home.tagline")}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-red-500">{counts.missing}</p>
              <p className="text-gray-500 text-xs mt-0.5">{t("status.missing")}</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-green-500">{counts.found_alive}</p>
              <p className="text-gray-500 text-xs mt-0.5">{t("status.found_alive")}</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-400">{counts.found_deceased}</p>
              <p className="text-gray-500 text-xs mt-0.5">{t("status.found_deceased")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span className="text-red-500">📍</span> {t("home.map_title")}
        </h2>
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-xl">
          <MapView persons={filtered} />
        </div>
      </section>

      {/* Registry */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold">
            📋 {t("home.registry_title")}
            <span className="ml-2 text-gray-500 font-normal text-base">({filtered.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "missing", "found_alive", "found_deceased", "unknown"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {s === "all" ? "All" : t(`status.${s}`)}
              </button>
            ))}
          </div>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        {filtered.length === 0 ? (
          <div className="mt-16 text-center text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold text-gray-500">No results found</p>
            <p className="text-sm mt-1">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {filtered.map(p => (
              <PersonCard key={p.id} person={p}
                href={staticIds.has(p.id) ? undefined : `/persons/view/?id=${encodeURIComponent(p.id)}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
