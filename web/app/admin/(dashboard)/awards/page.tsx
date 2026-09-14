import { getAwardStats } from "@/lib/content";
import { addAwardStat, updateAwardStat, deleteAwardStat, moveAwardStat } from "./actions";

export default async function AdminAwardsPage() {
  const stats = await getAwardStats();

  return (
    <>
      <h1>Awards strip</h1>
      <p className="admin-subtitle">The row of accolades shown under the hero.</p>
      <div className="admin-card">
        <div className="admin-list">
          {stats.map((s, i) => (
            <div className="admin-list-item" key={s.id}>
              <div className="admin-order-btns">
                <form action={moveAwardStat.bind(null, s.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveAwardStat.bind(null, s.id, 1)}>
                  <button type="submit" disabled={i === stats.length - 1}>↓</button>
                </form>
              </div>
              <form
                style={{ flex: 1, display: "flex", gap: 10 }}
                action={updateAwardStat.bind(null, s.id)}
              >
                <input name="label" defaultValue={s.label} style={{ flex: 1 }} />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">Save</button>
                </div>
              </form>
              <form action={deleteAwardStat.bind(null, s.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add an item</h3>
        <form style={{ display: "flex", gap: 10 }} action={addAwardStat}>
          <input name="label" placeholder="e.g. Winner — Best Songwriter" required style={{ flex: 1 }} />
          <button className="admin-btn" type="submit">Add</button>
        </form>
      </div>
    </>
  );
}
