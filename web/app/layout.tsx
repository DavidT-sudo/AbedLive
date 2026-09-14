import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, Jost } from "next/font/google";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Loaded now (unused by the current "press" theme) so the future "open-sky"
// theme (design 1b) doesn't need a font-loading change to switch over.
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Abed Live",
  description:
    "Abednico Wadingalo — Contemporary Gospel, Afro-Jazz, Praise & Worship from Molepolole, Botswana.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const theme = settings?.theme || "press";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${archivo.variable} ${bodoniModa.variable} ${jost.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
