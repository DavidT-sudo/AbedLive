"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { openSkyIntro, openSkyEditions } from "@/db/schema";
import { requireEditor } from "@/lib/session";
import { uploadMediaFromForm } from "@/lib/media-actions";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/open-sky");
}

export async function updateOpenSkyIntro(formData: FormData) {
  await requireEditor();
  await db
    .update(openSkyIntro)
    .set({
      eyebrow: String(formData.get("eyebrow") || ""),
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      ctaLabel: String(formData.get("ctaLabel") || ""),
      ctaHref: String(formData.get("ctaHref") || ""),
      updatedAt: new Date(),
    })
    .where(eq(openSkyIntro.id, "default"));
  refresh();
}

export async function addOpenSkyEdition(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(openSkyEditions);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  const title = String(formData.get("title") || "");
  const posterImageId = await uploadMediaFromForm(formData, "poster", { alt: title });
  await db.insert(openSkyEditions).values({ title, posterImageId, sortOrder: maxOrder + 1 });
  refresh();
}

export async function updateOpenSkyEdition(id: string, formData: FormData) {
  await requireEditor();
  const title = String(formData.get("title") || "");
  const posterImageId = await uploadMediaFromForm(formData, "poster", { alt: title });
  await db
    .update(openSkyEditions)
    .set({ title, ...(posterImageId ? { posterImageId } : {}) })
    .where(eq(openSkyEditions.id, id));
  refresh();
}

export async function deleteOpenSkyEdition(id: string) {
  await requireEditor();
  await db.delete(openSkyEditions).where(eq(openSkyEditions.id, id));
  refresh();
}

export async function moveOpenSkyEdition(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db.select().from(openSkyEditions).orderBy(asc(openSkyEditions.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;
  const a = rows[index];
  const b = rows[swapIndex];
  await db.update(openSkyEditions).set({ sortOrder: b.sortOrder }).where(eq(openSkyEditions.id, a.id));
  await db.update(openSkyEditions).set({ sortOrder: a.sortOrder }).where(eq(openSkyEditions.id, b.id));
  refresh();
}
