"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireEditor } from "@/lib/session";

export async function updateSettings(formData: FormData) {
  await requireEditor();
  await db
    .update(siteSettings)
    .set({
      siteTitle: String(formData.get("siteTitle") || ""),
      theme: String(formData.get("theme") || "press"),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, "default"));
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
