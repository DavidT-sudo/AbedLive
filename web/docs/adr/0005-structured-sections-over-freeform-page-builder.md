# 0005 — Admin content stays structured typed sections, no freeform page builder

## Status
**Proposed — flagged for decision, not yet implemented or confirmed.**

## Context
The question was raised: could `/admin` grow an Elementor-style visual
page builder, so non-technical editors can freely build/rearrange the
frontend themselves?

Two real patterns exist on production business sites today, at very
different weights:

- **Full freeform builder** (Webflow, Wix, Squarespace Fluid Engine,
  WordPress + Elementor/Divi): a canvas editor, arbitrary widget
  composition, per-element CSS, responsive breakpoint system, undo/redo
  history. This is the *core product* for those companies — years of
  engineering by dedicated teams, not a feature to bolt onto a one-artist
  brand site.
- **Reorderable typed sections** (Shopify's theme editor / Online Store
  2.0 "sections" model): a fixed catalog of typed sections (hero,
  discography, about, ...), each with its own config form, that editors
  can reorder, toggle visibility on/off, and adjust a constrained set of
  style props (spacing/color/alignment) for — no freeform canvas, no
  arbitrary widgets.

AbedLive's `/admin` is already a structured CMS in the second pattern's
shape (typed sections in `db/schema.ts`: hero, awards, about, discography,
live highlights, Open Sky, Beyond Music, contact, settings) — it just
doesn't yet support reordering, visibility toggling, or per-section style
overrides.

## Decision (proposed)
Do **not** build a full freeform canvas builder. Instead, extend the
existing typed-section model with: an `order` + `visible` field per
section row, a small `styleOverrides` JSON column with a constrained form
UI (not arbitrary CSS), and a flat drag-reorder list in `/admin` (e.g.
`dnd-kit` on a flat list — materially simpler than a canvas). The
renderer iterates sections in order and applies overrides, same as today
just data-driven instead of hardcoded.

## Consequences (if adopted)
- Editors get real, meaningful layout control (what shows, in what order,
  roughly how it looks) without the site being able to visually break in
  the way a freeform builder allows.
- Estimated a focused 1-2 weeks of work against the current schema and
  component library, vs. a multi-week-to-multi-month rebuild for a true
  freeform builder.
- Forecloses, for now, requests like "let an editor place an arbitrary
  custom block anywhere" — if that need becomes real and concrete later,
  it would need a fresh decision (a new ADR), not a quiet scope-creep of
  this one.

## Next step
Awaiting explicit go-ahead before any implementation starts — this ADR
exists to record the trade-off and get an intentional decision on the
record, not to greenlight work.
