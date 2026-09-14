"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#discography", label: "Discography" },
  { href: "#live", label: "Live" },
  { href: "#beyond-music", label: "Beyond Music" },
  { href: "#contact", label: "Bookings", emphasize: true },
];

export function SiteHeader({ logoUrl }: { logoUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a href="#top" onClick={() => setOpen(false)}>
        <img className="site-header__logo" src={logoUrl} alt="Abed" />
      </a>
      <nav className="site-header__nav" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-current={link.emphasize ? true : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="site-header__toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>
      <div className="mobile-nav" data-open={open} aria-hidden={!open}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
