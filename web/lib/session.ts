import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Authoritative session check — call this in every admin page and Server Action. */
export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Requires any signed-in team member (admin or editor). Redirects otherwise. */
export async function requireEditor() {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Requires the admin role specifically (team management, danger zone, etc). */
export async function requireAdmin() {
  const session = await requireEditor();
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") redirect("/admin");
  return session;
}
