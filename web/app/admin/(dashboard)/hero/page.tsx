import Image from "next/image";
import {getHero} from "@/lib/content";
import {ACCEPTED_IMAGE_ACCEPT_ATTR, ACCEPTED_IMAGE_FORMATS_LABEL} from "@/lib/media-validation";
import {updateHero, removeHeroImage} from "./actions";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const hero = await getHero();
  const {error} = await searchParams;

  return (
    <>
      <h1>Hero</h1>
      <p className="admin-subtitle">
        The full-bleed section at the top of the homepage.
      </p>
      {error && <p className="admin-error" style={{marginBottom: 20}}>{error}</p>}
      <div className="admin-card">
        <form className="admin-form" action={updateHero}>
          <div className="admin-form-row">
            <label>
              Title line 1
              <input
                name="titleLine1"
                defaultValue={hero?.titleLine1}
                required
              />
            </label>
            <label>
              Title line 2
              <input
                name="titleLine2"
                defaultValue={hero?.titleLine2}
                required
              />
            </label>
          </div>
          <label>
            Kicker (small caption under the title)
            <input name="kicker" defaultValue={hero?.kicker} />
          </label>
          <div className="admin-form-row">
            <label>
              Location line
              <input name="locationLine" defaultValue={hero?.locationLine} />
            </label>
            <label>
              Genre line
              <input name="genreLine" defaultValue={hero?.genreLine} />
            </label>
          </div>
          <label>
            Release note (e.g. &ldquo;With Kgosi Jeso (Live) — out now&rdquo;)
            <input name="releaseNote" defaultValue={hero?.releaseNote} />
          </label>
          <div className="admin-form-row">
            <label>
              Release CTA label
              <input
                name="releaseCtaLabel"
                defaultValue={hero?.releaseCtaLabel}
              />
            </label>
            <label>
              Release CTA link
              <input
                name="releaseCtaHref"
                defaultValue={hero?.releaseCtaHref}
              />
            </label>
          </div>
          <label>
            Background image
            {hero?.imageUrl && (
              <div className="admin-image-preview">
                <Image
                  src={hero.imageUrl}
                  alt=""
                  width={160}
                  height={100}
                  unoptimized
                  style={{objectFit: "cover"}}
                />
              </div>
            )}
            <input type="file" name="image" accept={ACCEPTED_IMAGE_ACCEPT_ATTR} />
            <span className="admin-file-hint">Accepted formats: {ACCEPTED_IMAGE_FORMATS_LABEL}. Max 15MB.</span>
          </label>
          {hero?.imageUrl && (
            <form action={removeHeroImage}>
              <button className="admin-btn admin-btn--ghost" type="submit">
                Remove background image
              </button>
            </form>
          )}
          <div className="admin-actions">
            <button className="admin-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
