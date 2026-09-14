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
  // Falls back to the default theme if the database isn't reachable —
  // notably during `next build`'s static-generation pass for pages like
  // /admin/login, which would otherwise fail the whole build whenever the
  // database happens to be unavailable at build time (e.g. the Docker
  // builder stage, which never has real database credentials).
  const theme = await getSiteSettings()
    .then((settings) => settings?.theme || "press")
    .catch(() => "press");

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
