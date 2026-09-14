import type { getBeyondMusicItems } from "@/lib/content";

export function BeyondMusic({
  items,
}: {
  items: Awaited<ReturnType<typeof getBeyondMusicItems>>;
}) {
  if (!items.length) return null;
  return (
    <section className="section section--alt" id="beyond-music">
      <div className="section-head">
        <div className="section-head__title">
          <span className="section-head__num">04</span>
          <span className="section-head__label">BEYOND MUSIC</span>
        </div>
      </div>
      <div className="beyond-grid">
        {items.map((item) => (
          <div key={item.id}>
            <div className="beyond-grid__kicker">{item.kicker}</div>
            <div className="beyond-grid__title">{item.title}</div>
            <p className="beyond-grid__body">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
