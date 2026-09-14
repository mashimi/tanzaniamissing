import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "Tanzania Missing Persons & Disappearances Registry",
  description: "Independent, open-source database documenting missing persons and enforced disappearances in Tanzania with safety and privacy protection.",
  keywords: ["Tanzania", "Missing Persons", "Disappearances", "Human Rights", "Registry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-red-500/30 selection:text-red-200">
        <I18nProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
