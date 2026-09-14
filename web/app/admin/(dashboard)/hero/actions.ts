"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { requireEditor } from "@/lib/session";
import { uploadMediaFromForm } from "@/lib/media-actions";

export async function updateHero(formData: FormData) {
  await requireEditor();

  const imageId = await uploadMediaFromForm(formData, "image", {
    alt: "Hero image",
  });

  await db
    .update(heroContent)
    .set({
      kicker: String(formData.get("kicker") || ""),
      titleLine1: String(formData.get("titleLine1") || ""),
      titleLine2: String(formData.get("titleLine2") || ""),
      locationLine: String(formData.get("locationLine") || ""),
      genreLine: String(formData.get("genreLine") || ""),
      releaseNote: String(formData.get("releaseNote") || ""),
      releaseCtaLabel: String(formData.get("releaseCtaLabel") || ""),
      releaseCtaHref: String(formData.get("releaseCtaHref") || ""),
      ...(imageId ? { imageId } : {}),
      updatedAt: new Date(),
    })
    .where(eq(heroContent.id, "default"));

  revalidatePath("/");
  revalidatePath("/admin/hero");
}
