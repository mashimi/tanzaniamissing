"use client";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm
                           group-hover:bg-red-500 transition-colors">?</span>
          <span className="font-bold text-red-500 text-sm leading-tight hidden sm:block">
            {t("site.title")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">{t("nav.home")}</Link>
          <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">{t("nav.about")}</Link>
          <Link
            href="/submit/"
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            {t("nav.submit")}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-gray-400 hover:text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden bg-gray-950 border-t border-gray-800 px-4 pb-4 pt-3 space-y-3">
          <Link href="/" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white py-1">
            {t("nav.home")}
          </Link>
          <Link href="/about/" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-white py-1">
            {t("nav.about")}
          </Link>
          <Link href="/submit/" onClick={() => setOpen(false)}
            className="block bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-center">
            {t("nav.submit")}
          </Link>
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
