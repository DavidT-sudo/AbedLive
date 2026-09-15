import type { getAwardStats } from "@/lib/content";

export function AwardsStrip({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getAwardStats>>;
}) {
  if (!stats.length) return null;
  const items = stats.map((s) => s.label);
  const track = [...items, ...items];
  return (
    <div className="awards-strip">
      <div className="awards-strip__track">
        {track.map((label, i) => (
          <span className="awards-strip__item" key={i}>
            {label}
            <span className="awards-strip__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
