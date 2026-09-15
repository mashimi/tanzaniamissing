"use client";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-gray-800 py-10 px-4 text-center space-y-3">
      <div className="flex justify-center gap-4 text-xs text-gray-600 mb-2">
        <a href="/" className="hover:text-gray-400 transition-colors">Home</a>
        <span>·</span>
        <a href="/about/" className="hover:text-gray-400 transition-colors">About</a>
        <span>·</span>
        <a href="/submit/" className="hover:text-gray-400 transition-colors">Report</a>
      </div>
      <p className="text-gray-600 text-xs max-w-lg mx-auto leading-relaxed">
        {t("footer.disclaimer")}
      </p>
      
      {/* Redundancy Mirrors Section */}
      <div className="pt-2 text-xs text-gray-500 space-y-1">
        <div className="text-gray-600 font-medium">{t("footer.mirror")}:</div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-500">
          <a href="https://www.tanzania.qd.je" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">www.tanzania.qd.je</a>
          <span>·</span>
          <a href="https://mp-tz.pages.dev" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">mp-tz.pages.dev</a>
          <span>·</span>
          <a href="https://mirror.tanzania.qd.je" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">mirror.tanzania.qd.je</a>
          <span>·</span>
          <span className="text-gray-700" title="Tor / IPFS Redundancy active">Tor / IPFS Ready</span>
        </div>
      </div>

      <p className="text-gray-700 text-xs pt-2">
        CC BY-NC 4.0 · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
