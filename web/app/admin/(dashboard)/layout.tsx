import Link from "next/link";
import { requireEditor } from "@/lib/session";
import { SignOutButton } from "@/components/admin/sign-out-button";
import "../admin.css";

const NAV = [
  { group: "Content", links: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/hero", label: "Hero" },
    { href: "/admin/awards", label: "Awards strip" },
    { href: "/admin/about", label: "About" },
    { href: "/admin/discography", label: "Discography" },
    { href: "/admin/live", label: "Live highlights" },
    { href: "/admin/open-sky", label: "Open Sky Gathering" },
    { href: "/admin/beyond-music", label: "Beyond Music" },
    { href: "/admin/contact", label: "Contact & socials" },
  ]},
  { group: "Site", links: [
    { href: "/admin/settings", label: "Settings & theme" },
    { href: "/admin/team", label: "Team" },
  ]},
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireEditor();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Abed Live — Admin</h2>
        {NAV.map((section) => (
          <div key={section.group}>
            <div className="admin-sidebar__group-label">{section.group}</div>
            {section.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="admin-sidebar__foot">
          <div style={{ padding: "0 8px 8px" }}>
            {session.user.name || session.user.email}
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
