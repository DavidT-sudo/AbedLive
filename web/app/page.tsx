import { getHomepageData } from "@/lib/content";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { AwardsStrip } from "@/components/site/awards-strip";
import { About } from "@/components/site/about";
import { Discography } from "@/components/site/discography";
import { PurposeBreak } from "@/components/site/purpose-break";
import { LiveSection } from "@/components/site/live-section";
import { BeyondMusic } from "@/components/site/beyond-music";
import { SiteFooter } from "@/components/site/site-footer";

// Content is edited live via /admin — never statically cache this route.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <SiteHeader logoUrl="/media/signature-black.png" />
      <main>
        <Hero hero={data.hero} />
        <AwardsStrip stats={data.stats} />
        <About about={data.about} />
        <Discography releases={data.discography} />
        <PurposeBreak
          slot={data.purposeBreak}
          tagline={data.contact?.footerTagline || "Purpose in every note"}
        />
        <LiveSection
          highlights={data.live}
          openSky={data.openSky}
          posters={data.openSkyPosters}
        />
        <BeyondMusic items={data.beyondMusic} />
      </main>
      <SiteFooter
        contact={data.contact}
        socials={data.socials}
        logoUrl="/media/signature-white.png"
      />
    </>
  );
}
