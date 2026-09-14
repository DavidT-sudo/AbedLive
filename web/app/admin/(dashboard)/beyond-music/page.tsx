import { getBeyondMusicItems } from "@/lib/content";
import {
  addBeyondMusicItem,
  updateBeyondMusicItem,
  deleteBeyondMusicItem,
  moveBeyondMusicItem,
} from "./actions";

export default async function AdminBeyondMusicPage() {
  const items = await getBeyondMusicItems();

  return (
    <>
      <h1>Beyond Music</h1>
      <p className="admin-subtitle">Profession, coaching and podcast cards.</p>
      <div className="admin-card">
        <div className="admin-list">
          {items.map((item, i) => (
            <div className="admin-list-item" key={item.id} style={{ alignItems: "flex-start" }}>
              <div className="admin-order-btns">
                <form action={moveBeyondMusicItem.bind(null, item.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveBeyondMusicItem.bind(null, item.id, 1)}>
                  <button type="submit" disabled={i === items.length - 1}>↓</button>
                </form>
              </div>
              <form className="admin-form" style={{ flex: 1 }} action={updateBeyondMusicItem.bind(null, item.id)}>
                <div className="admin-form-row">
                  <input name="kicker" defaultValue={item.kicker} placeholder="Kicker (e.g. Profession)" />
                  <input name="title" defaultValue={item.title} placeholder="Title" />
                </div>
                <textarea name="body" defaultValue={item.body} rows={2} />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">Save</button>
                </div>
              </form>
              <form action={deleteBeyondMusicItem.bind(null, item.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add an item</h3>
        <form className="admin-form" action={addBeyondMusicItem}>
          <div className="admin-form-row">
            <input name="kicker" placeholder="Kicker" />
            <input name="title" placeholder="Title" required />
          </div>
          <textarea name="body" placeholder="Body" rows={2} />
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Add</button>
          </div>
        </form>
      </div>
    </>
  );
}
