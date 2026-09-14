"use client";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-gray-800 py-10 px-4 text-center space-y-3">
      <div className="flex justify-center gap-4 text-xs text-gray-600 mb-2">
        <a href="/" className="hover:text-gray-400 transition-colors">Home</a>
        <span>·</span>
        <a href="/submit/" className="hover:text-gray-400 transition-colors">Report</a>
      </div>
      <p className="text-gray-600 text-xs max-w-lg mx-auto leading-relaxed">
        {t("footer.disclaimer")}
      </p>
      <p className="text-gray-800 text-xs">
        CC BY-NC 4.0 · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
