# Design source — kept for reference

This folder is the original Claude Design handoff bundle for Abed's website.
The actual site is implemented as real code in `../web/` — everything here
is source material, kept intentionally so a future Claude session (or
anyone else) can go back to the original design intent, source assets, or
process instead of reverse-engineering it from the live site.

**Don't delete this folder or its contents as "cleanup"** unless a human
explicitly asks for it — it looks like scratch material, but it's the
design's primary source, not a build artifact.

## Contents

- **`Abed Live Website.dc.html`** — the actual design file, two full
  directions (1a "Press Sheet", 1b "Open Sky") at wide and mobile widths.
  Both have been implemented in `../web/` (see its README for which theme
  is live and how to switch).
- **`support.js`** — runtime support script the `.dc.html` file loads;
  part of the design file, not standalone.
- **`assets/`** — the source images the design references (covers, posters,
  portraits, the signature marks). These were copied into
  `../web/public/media/` for the live site; the ones actually used by the
  design are listed in `Abed Live Website.dc.html` itself. A couple of
  files in here (`card-signature.png`, `poster-opensky-4b.png`) are unused
  variants the design tool generated along the way — not referenced by the
  design or the site, kept anyway rather than guessed away.
- **`scraps/`** — intermediate render and debug previews Claude Design
  produced while generating the handoff bundle (bio page renders, sig
  checks, per-section previews). Not referenced by anything. Useful only
  if you want to see how the design evolved step by step.
- **`uploads/Abed_Live  Bio.pdf`** — the original bio document the design
  (and the site's About/Discography/etc. content) was built from. The
  source of truth for facts if anything in the live content needs
  double-checking.
- **`.thumbnail`** — Claude Design's own UI thumbnail for this project.
  Cosmetic, not used by anything.

## Related

- `../README.md` — the handoff bundle's own top-level instructions for a
  coding agent picking this up.
- `../chats/` — the conversation transcript between the user and the
  design assistant that produced this bundle.
- `../web/` — the actual implemented site (Next.js, Postgres, self-hosted
  CMS). See `../web/README.md` for how it's built and deployed.
