import Image from "next/image";
import {getOpenSkyIntro, getOpenSkyEditions} from "@/lib/content";
import {ACCEPTED_IMAGE_ACCEPT_ATTR, ACCEPTED_IMAGE_FORMATS_LABEL} from "@/lib/media-validation";
import {
  updateOpenSkyIntro,
  addOpenSkyEdition,
  updateOpenSkyEdition,
  deleteOpenSkyEdition,
  moveOpenSkyEdition,
  removeOpenSkyEditionPoster,
} from "./actions";

export default async function AdminOpenSkyPage({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const [intro, editions] = await Promise.all([
    getOpenSkyIntro(),
    getOpenSkyEditions(),
  ]);
  const {error} = await searchParams;

  return (
    <>
      <h1>Open Sky Gathering</h1>
      <p className="admin-subtitle">Intro copy and edition posters.</p>
      {error && <p className="admin-error" style={{marginBottom: 20}}>{error}</p>}

      <div className="admin-card">
        <form className="admin-form" action={updateOpenSkyIntro}>
          <div className="admin-form-row">
            <label>
              Eyebrow
              <input name="eyebrow" defaultValue={intro?.eyebrow} />
            </label>
            <label>
              Title
              <input name="title" defaultValue={intro?.title} />
            </label>
          </div>
          <label>
            Body
            <textarea name="body" defaultValue={intro?.body} rows={3} />
          </label>
          <div className="admin-form-row">
            <label>
              CTA label
              <input name="ctaLabel" defaultValue={intro?.ctaLabel} />
            </label>
            <label>
              CTA link
              <input name="ctaHref" defaultValue={intro?.ctaHref} />
            </label>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>

      <h2 style={{fontSize: 15, marginTop: 32}}>Editions</h2>
      <div className="admin-card">
        <div className="admin-list">
          {editions.map((e, i) => (
            <div className="admin-list-item" key={e.id}>
              <div className="admin-order-btns">
                <form action={moveOpenSkyEdition.bind(null, e.id, -1)}>
                  <button type="submit" disabled={i === 0}>
                    ↑
                  </button>
                </form>
                <form action={moveOpenSkyEdition.bind(null, e.id, 1)}>
                  <button type="submit" disabled={i === editions.length - 1}>
                    ↓
                  </button>
                </form>
              </div>
              {e.posterUrl && (
                <div style={{display: "flex", flexDirection: "column", gap: 6, flex: "none"}}>
                  <Image
                    src={e.posterUrl}
                    alt=""
                    width={120}
                    height={120}
                    unoptimized
                  />
                  <form action={removeOpenSkyEditionPoster.bind(null, e.id)}>
                    <button
                      className="admin-btn admin-btn--ghost"
                      type="submit"
                      style={{fontSize: 11, padding: "5px 8px", width: "100%"}}
                    >
                      Remove
                    </button>
                  </form>
                </div>
              )}
              <form
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
                action={updateOpenSkyEdition.bind(null, e.id)}
              >
                <input name="title" defaultValue={e.title} style={{flex: 1}} />
                <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                  <input type="file" name="poster" accept={ACCEPTED_IMAGE_ACCEPT_ATTR} />
                  <span className="admin-file-hint">{ACCEPTED_IMAGE_FORMATS_LABEL}. Max 15MB.</span>
                </div>
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteOpenSkyEdition.bind(null, e.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
        <h3 style={{fontSize: 13, marginTop: 20}}>Add an edition</h3>
        <form className="admin-form-row" action={addOpenSkyEdition}>
          <input name="title" placeholder="e.g. 5th Edition" required />
          <div style={{display: "flex", flexDirection: "column", gap: 4}}>
            <input type="file" name="poster" accept={ACCEPTED_IMAGE_ACCEPT_ATTR} />
            <span className="admin-file-hint">Accepted formats: {ACCEPTED_IMAGE_FORMATS_LABEL}. Max 15MB.</span>
          </div>
          <button className="admin-btn" type="submit">
            Add
          </button>
        </form>
      </div>
    </>
  );
}
