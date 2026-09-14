import type { getAwardStats } from "@/lib/content";

export function OpenSkyMarquee({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getAwardStats>>;
}) {
  if (!stats.length) return null;
  const items = stats.map((s) => s.label);
  const track = [...items, ...items];
  return (
    <div className="os-marquee">
      <div className="os-marquee__track">
        {track.map((label, i) => (
          <span key={i}>
            {label}
            <span className="os-marquee__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
