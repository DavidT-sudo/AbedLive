import { getTopTracks } from "@/lib/content";
import { addTopTrack, updateTopTrack, deleteTopTrack, moveTopTrack } from "./actions";

export default async function AdminTopTracksPage() {
  const tracks = await getTopTracks();

  return (
    <>
      <h1>Top tracks</h1>
      <p className="admin-subtitle">
        A browsable song collection (Spotify track embeds) shown near the
        discography — separate from full releases above.
      </p>
      <div className="admin-card">
        <div className="admin-list">
          {tracks.map((t, i) => (
            <div className="admin-list-item" key={t.id}>
              <div className="admin-order-btns">
                <form action={moveTopTrack.bind(null, t.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveTopTrack.bind(null, t.id, 1)}>
                  <button type="submit" disabled={i === tracks.length - 1}>↓</button>
                </form>
              </div>
              <form
                style={{ flex: 1, display: "flex", gap: 10, flexWrap: "wrap" }}
                action={updateTopTrack.bind(null, t.id)}
              >
                <input
                  name="title"
                  defaultValue={t.title}
                  placeholder="Track title"
                  style={{ flex: "1 1 160px" }}
                />
                <input
                  name="spotifyUrl"
                  defaultValue={t.spotifyUrl || ""}
                  placeholder="https://open.spotify.com/track/..."
                  style={{ flex: "2 1 260px" }}
                />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">Save</button>
                </div>
              </form>
              <form action={deleteTopTrack.bind(null, t.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add a track</h3>
        <form style={{ display: "flex", gap: 10, flexWrap: "wrap" }} action={addTopTrack}>
          <input
            name="title"
            placeholder="Track title"
            required
            style={{ flex: "1 1 160px" }}
          />
          <input
            name="spotifyUrl"
            placeholder="https://open.spotify.com/track/..."
            style={{ flex: "2 1 260px" }}
          />
          <button className="admin-btn" type="submit">Add</button>
        </form>
      </div>
    </>
  );
}
