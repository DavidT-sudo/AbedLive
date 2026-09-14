import { requireEditor } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import "../admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireEditor();

  return (
    <div className="admin-shell">
      <AdminSidebar userLabel={session.user.name || session.user.email} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
