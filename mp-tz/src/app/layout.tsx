import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/i18n/I18nProvider";

const SITE_URL = "https://www.tanzania.qd.je";
const TITLE = "Tanzania Missing Persons & Disappearances Registry";
const DESCRIPTION =
  "Independent, volunteer-maintained registry documenting missing persons and enforced disappearances in Tanzania. Search documented cases with verified sources and report sightings anonymously. Swahili/English.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Tanzania Missing Persons Registry",
  },
  description: DESCRIPTION,
  keywords: [
    "missing persons Tanzania",
    "enforced disappearance Tanzania",
    "waliopotea Tanzania",
    "watu waliopotea",
    "abductions Tanzania",
    "CHADEMA",
    "human rights Tanzania",
    "report missing person",
    "utekaji wa watu",
    "missing persons registry",
  ],
  alternates: { canonical: "/" },
  // Ownership proof for Google Search Console (HTML HTML-tag method).
  // The qd.je zone 308-redirects *.html URLs, so the HTML file method can
  // never stabilize; this meta tag on the homepage is the stable token.
  verification: {
    google: "62EJ-Ifd9iZEXH-Y6GDqDfXjUaEMReh6Ha9_DwmaXZ8",
  },
  openGraph: {
    type: "website",
    siteName: TITLE,
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    locale: "sw_KE",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: TITLE,
      alternateName: "Rejista ya Watu Waliopotea – Tanzania",
      url: `${SITE_URL}/`,
      description: DESCRIPTION,
      inLanguage: ["sw", "en"],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Tanzania Missing Persons Registry",
      alternateName: "Rejista ya Watu Waliopotea – Tanzania",
      url: `${SITE_URL}/`,
      description:
        "Civil-society volunteers documenting every case of enforced disappearance in Tanzania so that no one is forgotten.",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
  );
}
