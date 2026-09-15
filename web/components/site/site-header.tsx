"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string; emphasize?: boolean };

export function SiteHeader({
  logoUrl,
  logoUrlLight,
  navLinks,
  cta,
}: {
  logoUrl: string;
  logoUrlLight: string;
  navLinks: NavLink[];
  cta?: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The header floats transparently over the hero on landing and only
  // becomes the solid bar once the user has scrolled well past it.
  // Threshold is derived from the hero's own height so it still makes
  // sense if that content changes. Shared by every theme.
  useEffect(() => {
    const hero = document.getElementById("top");
    const threshold = hero ? hero.offsetHeight * 0.6 : 320;

    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the menu's own panel readable — don't leave the bar glassy above it.
  const solid = scrolled || open;

  return (
    <header className="site-header" data-scrolled={solid}>
      <a href="#top" onClick={() => setOpen(false)}>
        <Image
          className="site-header__logo site-header__logo--dark"
          src={logoUrl}
          alt="Abed"
          width={200}
          height={52}
        />
        <Image
          className="site-header__logo site-header__logo--light"
          src={logoUrlLight}
          alt="Abed"
          width={200}
          height={52}
        />
      </a>
      <nav className="site-header__nav" aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-current={link.emphasize ? true : undefined}
          >
            {link.label}
          </a>
        ))}
        {cta && (
          <a href={cta.href} className="site-header__cta">
            {cta.label}
          </a>
        )}
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
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        {cta && (
          <a
            href={cta.href}
            className="mobile-nav__cta"
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </a>
        )}
      </div>
    </header>
  );
}
