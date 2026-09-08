# Architecture

## Channels

| Decision | Choice | Why |
|---|---|---|
| Primary channels | Email, landing page, X, LinkedIn, short-form video | Where the existing customer base and prospects already are; no paid channels this phase |
| Priority | Email > landing page > social | Email reaches the existing base directly; social depends on organic reach, less certain |

## Tools

| Decision | Choice | Why |
|---|---|---|
| CMS | Existing Loopwell marketing site CMS | Already in use, no new tooling needed for one landing page |
| ESP | Existing email platform (customer list already there) | Avoids a list-migration project for one launch |
| Analytics | Existing dashboard | Launch tracking folds into it rather than a one-off spreadsheet |

## Data sources

| Decision | Choice | Why |
|---|---|---|
| Measurement | Existing analytics dashboard (opens/clicks/signups) | Already wired to the email platform and site |
| Access | Marketing team has direct access; Legal has read access to the sign-off thread only | Matches current permission model, no new access request needed |

## Fixed rules

- No paid promotion for this launch — organic channels only (per `planning/product.md`).
- Every publish-facing asset needs Legal sign-off before it goes out.

## Still to define

- Whether future launches get a paid-channel budget — deferred past this spec.

## Declined

| Idea | Why not |
|---|---|
| A dedicated landing-page builder tool | Existing CMS handles one page fine; adding a new tool is disproportionate for this spec. |
