import { requireAdmin } from "@/lib/session";
import { TeamManager } from "@/components/admin/team-manager";

export default async function AdminTeamPage() {
  const session = await requireAdmin();

  return (
    <>
      <h1>Team</h1>
      <p className="admin-subtitle">Who can sign in and edit abedlive.com.</p>
      <TeamManager currentUserId={session.user.id} />
    </>
  );
}
