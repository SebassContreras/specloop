# 001 — launch-announcement

> Example output of `specloop:start`'s Phase 7 (spec requirements Q&A), for a toy
> **marketing/content** target project — "Loopwell" (fictional SaaS product)
> announcing a new "Instant Export" feature. See `examples/README.md` for context.

## What's being built

- The launch announcement for Loopwell's "Instant Export" feature: one landing page,
  one announcement email, and three social posts (X, LinkedIn, one short-form video
  script).

## Who/what it serves

- Existing Loopwell customers (email list, ~40k) and prospective customers who land on
  the page from social/search.

## Hard constraints

- Must publish the week of the existing "Loopwell 3.0" event — no earlier, no later.
- Brand voice guide (`planning/styles.md`) applies to every asset; nothing goes out
  without a pass from Legal for claims about export speed ("instant").

## Acceptance criteria

- Landing page live at `/features/instant-export` with working CTA to the signup flow.
- Announcement email sent to the full list with open/click tracking wired to the
  existing analytics dashboard.
- All three social posts published on their respective channels within 48 hours of the
  email send.
- Legal has signed off on every asset's copy before it publishes.

## Out of scope

- Paid promotion/ad spend for this launch — organic channels only for this spec.
- Localization — English-only for the first pass; a later spec covers translated
  markets if the feature does well.
