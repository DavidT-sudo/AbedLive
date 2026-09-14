"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "@/components/admin/sign-out-button";

const NAV = [
  {
    group: "Content",
    links: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/awards", label: "Awards strip" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/discography", label: "Discography" },
      { href: "/admin/top-tracks", label: "Top tracks" },
      { href: "/admin/live", label: "Live highlights" },
      { href: "/admin/open-sky", label: "Open Sky Gathering" },
      { href: "/admin/beyond-music", label: "Beyond Music" },
      { href: "/admin/contact", label: "Contact & socials" },
    ],
  },
  {
    group: "Site",
    links: [
      { href: "/admin/settings", label: "Settings & theme" },
      { href: "/admin/team", label: "Team" },
    ],
  },
];

export function AdminSidebar({
  userLabel,
}: {
  userLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="admin-topbar">
        <span>Abed Live — Admin</span>
        <button
          type="button"
          className="admin-topbar__toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
      <aside className="admin-sidebar" data-open={open}>
        <h2>Abed Live — Admin</h2>
        {NAV.map((section) => (
          <div key={section.group}>
            <div className="admin-sidebar__group-label">{section.group}</div>
            {section.links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="admin-sidebar__foot">
          <div className="admin-sidebar__user">{userLabel}</div>
          <SignOutButton />
        </div>
      </aside>
      {open && (
        <button
          type="button"
          className="admin-sidebar__scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
