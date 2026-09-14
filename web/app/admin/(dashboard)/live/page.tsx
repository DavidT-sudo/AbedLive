import { getLiveHighlights } from "@/lib/content";
import { addLiveHighlight, updateLiveHighlight, deleteLiveHighlight, moveLiveHighlight } from "./actions";

export default async function AdminLivePage() {
  const highlights = await getLiveHighlights();

  return (
    <>
      <h1>Live highlights</h1>
      <p className="admin-subtitle">Shows and stage credits listed in the Live section.</p>
      <div className="admin-card">
        <div className="admin-list">
          {highlights.map((h, i) => (
            <div className="admin-list-item" key={h.id}>
              <div className="admin-order-btns">
                <form action={moveLiveHighlight.bind(null, h.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveLiveHighlight.bind(null, h.id, 1)}>
                  <button type="submit" disabled={i === highlights.length - 1}>↓</button>
                </form>
              </div>
              <form className="admin-form-row" style={{ flex: 1 }} action={updateLiveHighlight.bind(null, h.id)}>
                <input name="title" defaultValue={h.title} placeholder="Show name" />
                <input name="subtitle" defaultValue={h.subtitle} placeholder="Credit (e.g. Headline set)" />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">Save</button>
                </div>
              </form>
              <form action={deleteLiveHighlight.bind(null, h.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add a show</h3>
        <form className="admin-form-row" action={addLiveHighlight}>
          <input name="title" placeholder="Show name" required />
          <input name="subtitle" placeholder="Credit" />
          <button className="admin-btn" type="submit">Add</button>
        </form>
      </div>
    </>
  );
}
