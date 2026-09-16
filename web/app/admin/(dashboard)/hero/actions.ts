"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { requireEditor } from "@/lib/session";
import {
  uploadMediaFromForm,
  removeMedia,
  MediaValidationError,
} from "@/lib/media-actions";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function updateHero(formData: FormData) {
  await requireEditor();

  let imageId: string | null;
  try {
    imageId = await uploadMediaFromForm(formData, "image", {
      alt: "Hero image",
    });
  } catch (err) {
    if (err instanceof MediaValidationError) {
      redirect(`/admin/hero?error=${encodeURIComponent(err.message)}`);
    }
    throw err;
  }

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

  refresh();
}

export async function removeHeroImage() {
  await requireEditor();
  const [row] = await db.select().from(heroContent).where(eq(heroContent.id, "default"));
  if (!row?.imageId) return;

  const oldImageId = row.imageId;
  await db
    .update(heroContent)
    .set({ imageId: null, updatedAt: new Date() })
    .where(eq(heroContent.id, "default"));
  await removeMedia(oldImageId);

  refresh();
}
