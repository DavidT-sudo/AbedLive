import type { getAwardStats } from "@/lib/content";

export function AwardsStrip({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getAwardStats>>;
}) {
  if (!stats.length) return null;
  return (
    <div className="awards-strip">
      {stats.map((s) => (
        <div className="awards-strip__item" key={s.id}>
          {s.label}
        </div>
      ))}
    </div>
  );
}
