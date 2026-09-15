"use client";
import { useI18n } from "@/i18n/I18nProvider";
import Photo from "./Photo";
import type { Person } from "@/lib/types";

const statusColor: Record<string, string> = {
  missing: "bg-red-600",
  found_alive: "bg-green-600",
  found_deceased: "bg-gray-600",
  unknown: "bg-yellow-600",
};

export default function PersonCard({ person: p, href }: { person: Person; href?: string }) {
  const { t } = useI18n();
  const initials = p.full_name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <a href={href ?? `/persons/${p.id}/`}
       className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:ring-2 hover:ring-red-500/40 transition-all duration-200 shadow-lg hover:shadow-red-900/20">
      {p.photo_path ? (
        <div className="relative w-full h-52 overflow-hidden bg-gray-800">
          <Photo src={p.photo_path} alt={p.full_name}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-52 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-5xl text-gray-600 font-bold select-none">
          {initials}
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white text-base leading-snug">{p.full_name}</h3>
          <span className={`shrink-0 ${statusColor[p.status]} text-[11px] px-2 py-0.5 rounded-full text-white font-semibold whitespace-nowrap`}>
            {t(`status.${p.status}`)}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          {t("person.age")}: <span className="text-gray-300">{p.age ?? "?"}</span>
          {" · "}
          <span className="text-gray-300">{p.location.region}</span>
        </p>
        <p className="text-gray-500 text-xs flex items-center gap-1">
          <span>{t("person.last_seen")}: {p.last_seen_date}</span>
          {!p.verified && (
            <span className="ml-1 text-yellow-500/80">· {t("person.unverified")}</span>
          )}
        </p>
        {p.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap pt-1">
            {p.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
