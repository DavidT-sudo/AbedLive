"use client";

import { useEffect } from "react";

const SECTION_SELECTOR =
  ".hero, .section, .os-hero, .os-story, .os-discography, .os-live";

// Native CSS scroll-snap has no way to control how strongly it pulls or how
// slowly it animates, and even `proximity` was yanking readers away from a
// section mid-paragraph. This does the same "settle on the nearest section"
// job, but only once scrolling has been idle for a beat, only when already
// close to a boundary (never mid-read), and with a deliberately slow, fully
// interruptible animation.
const IDLE_DELAY = 260; // ms of no scroll activity before we consider snapping
const SNAP_ZONE = 0.16; // only snap within this fraction of viewport height
const DURATION = 900; // ms — the "slower" ask
const HEADER_OFFSET = 74;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ScrollSnap() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let idleTimer: number | undefined;
    let animFrame: number | undefined;
    let programmaticScroll = false;

    function cancelAnimation() {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = undefined;
    }

    function animateTo(target: number) {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 2) return;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / DURATION);
        programmaticScroll = true;
        window.scrollTo(0, start + distance * easeInOutCubic(t));
        if (t < 1) {
          animFrame = requestAnimationFrame(step);
        } else {
          animFrame = undefined;
        }
      }
      animFrame = requestAnimationFrame(step);
    }

    function maybeSnap() {
      const sections = document.querySelectorAll<HTMLElement>(SECTION_SELECTOR);
      const viewportH = window.innerHeight;
      let best: { top: number; distance: number } | null = null;

      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const target = window.scrollY + rect.top - HEADER_OFFSET;
        const distance = Math.abs(rect.top - HEADER_OFFSET);
        if (!best || distance < best.distance) {
          best = { top: target, distance };
        }
      });

      if (best && best.distance > 3 && best.distance < viewportH * SNAP_ZONE) {
        animateTo(Math.max(0, best.top));
      }
    }

    function onScroll() {
      // Ignore the events our own animateTo() generates — only genuine
      // wheel/touch/keyboard scrolling should cancel a snap in progress.
      if (programmaticScroll) {
        programmaticScroll = false;
        return;
      }
      // Real user input: cancel any in-flight snap and restart the idle
      // clock — the user is always in control, never fought mid-motion.
      cancelAnimation();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(maybeSnap, IDLE_DELAY);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
      cancelAnimation();
    };
  }, []);

  return null;
}
