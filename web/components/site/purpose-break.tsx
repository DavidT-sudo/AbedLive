import type {getMediaSlot} from "@/lib/content";
import {SafeImage} from "@/components/site/safe-image";

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
        <SafeImage
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
