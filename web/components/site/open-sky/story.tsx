import Image from "next/image";
import type {getAbout} from "@/lib/content";

export function OpenSkyStory({
  about,
  releaseCount,
}: {
  about: Awaited<ReturnType<typeof getAbout>>;
  releaseCount: number;
}) {
  if (!about) return null;
  const [firstName, ...rest] = "Abednico Wadingalo".split(" ");
  return (
    <section className="os-story" id="about">
      <div className="os-story__portrait">
        <Image
          src="/media/portrait-white-jacket.png"
          alt="Abednico Wadingalo"
          width={800}
          height={900}
        />
        <div className="os-story__portrait-scrim" />
      </div>
      <div className="os-story__copy">
        <div className="os-eyebrow">The story</div>
        <div className="os-story__title">
          {firstName}
          <br />
          {rest.join(" ")}
        </div>
        <p className="os-story__p">{about.paragraph1}</p>
        {about.paragraph2 && (
          <p className="os-story__p os-story__p--soft">{about.paragraph2}</p>
        )}
        <div className="os-story__quote">
          <span>&ldquo;{about.quote}&rdquo;</span>
        </div>
        <div className="os-story__stats">
          <div>
            <div className="os-story__stat-num">4×</div>
            <div className="os-story__stat-label">
              Gospel Awards
              <br />
              nominee
            </div>
          </div>
          <div>
            <div className="os-story__stat-num">3×</div>
            <div className="os-story__stat-label">
              Award
              <br />
              winner
            </div>
          </div>
          <div>
            <div className="os-story__stat-num">{releaseCount}</div>
            <div className="os-story__stat-label">
              Releases
              <br />
              2017—2025
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
