"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactInfo, socialLinks } from "@/db/schema";
import { requireEditor } from "@/lib/session";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/contact");
}

export async function updateContact(formData: FormData) {
  await requireEditor();
  await db
    .update(contactInfo)
    .set({
      email: String(formData.get("email") || ""),
      phonePrimary: String(formData.get("phonePrimary") || ""),
      phoneSecondary: String(formData.get("phoneSecondary") || ""),
      footerTagline: String(formData.get("footerTagline") || ""),
      copyrightText: String(formData.get("copyrightText") || ""),
      updatedAt: new Date(),
    })
    .where(eq(contactInfo.id, "default"));
  refresh();
}

export async function addSocialLink(formData: FormData) {
  await requireEditor();
  const rows = await db.select().from(socialLinks);
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), -1);
  await db.insert(socialLinks).values({
    platform: String(formData.get("platform") || ""),
    handle: String(formData.get("handle") || ""),
    url: String(formData.get("url") || "#"),
    sortOrder: maxOrder + 1,
  });
  refresh();
}

export async function updateSocialLink(id: string, formData: FormData) {
  await requireEditor();
  await db
    .update(socialLinks)
    .set({
      platform: String(formData.get("platform") || ""),
      handle: String(formData.get("handle") || ""),
      url: String(formData.get("url") || "#"),
    })
    .where(eq(socialLinks.id, id));
  refresh();
}

export async function deleteSocialLink(id: string) {
  await requireEditor();
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  refresh();
}

export async function moveSocialLink(id: string, direction: -1 | 1) {
  await requireEditor();
  const rows = await db
    .select()
    .from(socialLinks)
    .orderBy(asc(socialLinks.sortOrder));
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = index + direction;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;

  const a = rows[index];
  const b = rows[swapIndex];
  await db
    .update(socialLinks)
    .set({ sortOrder: b.sortOrder })
    .where(eq(socialLinks.id, a.id));
  await db
    .update(socialLinks)
    .set({ sortOrder: a.sortOrder })
    .where(eq(socialLinks.id, b.id));
  refresh();
}
