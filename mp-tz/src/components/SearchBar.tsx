"use client";
import { useI18n } from "@/i18n/I18nProvider";

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="relative w-full max-w-lg">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
      <input
        type="search"
        placeholder={t("home.search_placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 text-white placeholder-gray-500
                   border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none
                   transition-colors text-sm"
      />
    </div>
  );
}
