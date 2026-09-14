import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderation — Tanzania Missing Persons Registry",
  robots: { index: false, follow: false },
};

export default function ModerateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
