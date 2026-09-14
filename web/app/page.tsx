import { getHomepageData } from "@/lib/content";
import { ScrollSnap } from "@/components/site/scroll-snap";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { AwardsStrip } from "@/components/site/awards-strip";
import { About } from "@/components/site/about";
import { Discography } from "@/components/site/discography";
import { Listen } from "@/components/site/listen";
import { PurposeBreak } from "@/components/site/purpose-break";
import { LiveSection } from "@/components/site/live-section";
import { BeyondMusic } from "@/components/site/beyond-music";
import { SiteFooter } from "@/components/site/site-footer";
import { OpenSkyHero } from "@/components/site/open-sky/hero";
import { OpenSkyMarquee } from "@/components/site/open-sky/marquee";
import { OpenSkyStory } from "@/components/site/open-sky/story";
import { OpenSkyDiscography } from "@/components/site/open-sky/discography";
import { OpenSkyListen } from "@/components/site/open-sky/listen";
import { OpenSkyLive } from "@/components/site/open-sky/live";
import { OpenSkyFooter } from "@/components/site/open-sky/footer";

// Content is edited live via /admin — never statically cache this route.
export const dynamic = "force-dynamic";

const PRESS_NAV = [
  { href: "#about", label: "About" },
  { href: "#discography", label: "Discography" },
  { href: "#tracks", label: "Listen" },
  { href: "#live", label: "Live" },
  { href: "#beyond-music", label: "Beyond Music" },
  { href: "#contact", label: "Bookings", emphasize: true },
];

const OPEN_SKY_NAV = [
  { href: "#about", label: "Story" },
  { href: "#discography", label: "Music" },
  { href: "#live", label: "Open Sky" },
  { href: "#beyond-music", label: "Podcast" },
];

export default async function HomePage() {
  const data = await getHomepageData();
  const theme = data.settings?.theme || "press";

  if (theme === "open-sky") {
    return (
      <>
        <ScrollSnap />
        <SiteHeader
          logoUrl="/media/signature-white.png"
          logoUrlLight="/media/signature-white.png"
          navLinks={OPEN_SKY_NAV}
          cta={{ label: "Book Abed", href: "#contact" }}
        />
        <main>
          <OpenSkyHero hero={data.hero} />
          <OpenSkyMarquee stats={data.stats} />
          <OpenSkyStory about={data.about} releaseCount={data.discography.length} />
          <OpenSkyDiscography releases={data.discography} />
          <OpenSkyListen tracks={data.topTracks} />
          <OpenSkyLive openSky={data.openSky} posters={data.openSkyPosters} />
          <BeyondMusic items={data.beyondMusic} />
        </main>
        <OpenSkyFooter contact={data.contact} socials={data.socials} />
      </>
    );
  }

  return (
    <>
      <ScrollSnap />
      <SiteHeader
        logoUrl="/media/signature-black.png"
        logoUrlLight="/media/signature-white.png"
        navLinks={PRESS_NAV}
      />
      <main>
        <Hero hero={data.hero} />
        <AwardsStrip stats={data.stats} />
        <About about={data.about} />
        <Discography releases={data.discography} />
        <Listen tracks={data.topTracks} />
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
