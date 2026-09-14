"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import en from "./locales/en.json";
import sw from "./locales/sw.json";

type Locale = "en" | "sw";
const dictionaries: Record<Locale, Record<string, string>> = { en, sw };

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx>({ locale: "sw", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("sw");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mp-tz-locale");
      if (saved === "en" || saved === "sw") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch { /* localStorage may be blocked */ }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("mp-tz-locale", l);
      document.documentElement.lang = l;
    } catch { /* ignore */ }
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    let msg = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) msg = msg.replaceAll(`{${k}}`, String(v));
    return msg;
  }, [locale]);

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
