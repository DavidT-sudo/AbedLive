import Image from "next/image";
import type { getMediaSlot } from "@/lib/content";

export function PurposeBreak({
  slot,
  tagline,
}: {
  slot: Awaited<ReturnType<typeof getMediaSlot>>;
  tagline: string;
}) {
  return (
    <div className="purpose-break">
      {slot?.url && (
        <Image
          className="purpose-break__image"
          src={slot.url}
          alt={slot.alt || ""}
          width={1600}
          height={900}
        />
      )}
      <div className="purpose-break__label">{tagline.toUpperCase()}</div>
    </div>
  );
}
