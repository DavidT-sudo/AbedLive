import Link from "next/link";

const CARDS = [
  { href: "/admin/hero", title: "Hero", desc: "Homepage headline, tagline, release CTA" },
  { href: "/admin/awards", title: "Awards strip", desc: "The four accolades under the hero" },
  { href: "/admin/about", title: "About", desc: "Bio copy, facts and belief quote" },
  { href: "/admin/discography", title: "Discography", desc: "Releases, covers, years" },
  { href: "/admin/live", title: "Live highlights", desc: "Shows and stage credits" },
  { href: "/admin/open-sky", title: "Open Sky Gathering", desc: "Intro copy and edition posters" },
  { href: "/admin/beyond-music", title: "Beyond Music", desc: "Profession, coaching, podcast" },
  { href: "/admin/contact", title: "Contact & socials", desc: "Email, phone, footer, social links" },
  { href: "/admin/settings", title: "Settings & theme", desc: "Site title, design direction" },
  { href: "/admin/team", title: "Team", desc: "Who can edit the site" },
];

export default function AdminDashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-subtitle">Edit what appears on abedlive.com.</p>
      <div className="admin-dashboard-grid">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="admin-dashboard-card">
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
