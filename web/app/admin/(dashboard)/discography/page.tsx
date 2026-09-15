import Image from "next/image";
import { getReleases } from "@/lib/content";
import { addRelease, updateRelease, deleteRelease, moveRelease } from "./actions";

export default async function AdminDiscographyPage() {
  const releases = await getReleases();

  return (
    <>
      <h1>Discography</h1>
      <p className="admin-subtitle">Releases shown in order, newest first.</p>
      <div className="admin-card">
        <div className="admin-list">
          {releases.map((r, i) => (
            <div className="admin-list-item" key={r.id} style={{ alignItems: "flex-start" }}>
              <div className="admin-order-btns">
                <form action={moveRelease.bind(null, r.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveRelease.bind(null, r.id, 1)}>
                  <button type="submit" disabled={i === releases.length - 1}>↓</button>
                </form>
              </div>
              {r.coverUrl && (
                <Image src={r.coverUrl} alt="" width={120} height={120} unoptimized />
              )}
              <form
                className="admin-form"
                style={{ flex: 1 }}
                action={updateRelease.bind(null, r.id)}
              >
                <div className="admin-form-row">
                  <input name="title" defaultValue={r.title} placeholder="Title" />
                  <input name="subtitle" defaultValue={r.subtitle ?? ""} placeholder="Subtitle (e.g. (Live))" />
                </div>
                <div className="admin-form-row">
                  <input name="kind" defaultValue={r.kind} placeholder="Kind (e.g. Extended play · Live)" />
                  <input name="note" defaultValue={r.note} placeholder="Note (e.g. Latest offering)" />
                  <input name="year" type="number" defaultValue={r.year} placeholder="Year" />
                </div>
                <div className="admin-form-row">
                  <label style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" name="isLatest" defaultChecked={r.isLatest} style={{ width: "auto" }} />
                    Mark as latest
                  </label>
                  <input type="file" name="cover" accept="image/*" />
                </div>
                <input
                  name="spotifyUrl"
                  defaultValue={r.spotifyUrl ?? ""}
                  placeholder="Spotify link (track, album, or artist — open.spotify.com/...)"
                  pattern="https://open\.spotify\.com/.*"
                  title="Paste a link from open.spotify.com"
                />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">Save</button>
                </div>
              </form>
              <form action={deleteRelease.bind(null, r.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add a release</h3>
        <form className="admin-form" action={addRelease}>
          <div className="admin-form-row">
            <input name="title" placeholder="Title" required />
            <input name="subtitle" placeholder="Subtitle" />
          </div>
          <div className="admin-form-row">
            <input name="kind" placeholder="Kind" />
            <input name="note" placeholder="Note" />
            <input name="year" type="number" placeholder="Year" required />
          </div>
          <input type="file" name="cover" accept="image/*" />
          <input
            name="spotifyUrl"
            placeholder="Spotify link (track, album, or artist — open.spotify.com/...)"
            pattern="https://open\.spotify\.com/.*"
            title="Paste a link from open.spotify.com"
          />
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Add release</button>
          </div>
        </form>
      </div>
    </>
  );
}
