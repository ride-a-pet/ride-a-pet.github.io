# Design QA — Resource-header and home hero refinement

## Scope and evidence

- Source evidence: the two user-supplied screenshots describing the broken desktop layout (navigation placement, the home breadcrumb, and the full-width hero crop).
- Implementation checked: local development site at `http://localhost:3002/` and the generated static output in `out/`.
- Responsive intent: desktop uses a left-aligned horizontal brand and a right-aligned navigation row; at narrower widths the navigation wraps cleanly and the hero changes from two columns to one.

The screenshots are issue annotations rather than a target page to copy pixel-for-pixel. QA therefore checks the three requested layout corrections.

## Before / after

| Area | Issue shown | Implemented result |
| --- | --- | --- |
| Global header | Logo image and “Ride A Pet” were vertically stacked; navigation sat underneath; an unnecessary “GAME RESOURCE CENTER” label appeared. | A single flex header places logo + name side by side on the left and the five page links on the right. The label is removed. |
| Home breadcrumb | “Home” appeared above the landing-page content. | No breadcrumb is rendered on `/`; inner pages continue to render their breadcrumb. |
| Home hero | Cover art filled a shallow, wide strip above the text and was cropped awkwardly. | The hero is a two-column grid: copy and CTA on the left, responsive cover art on the right. It stacks to copy-first/image-second on small screens. |

## Focused checks

- Header navigation has an explicit desktop `margin-left: auto`, an 1180px max content width, and no fixed-width nav container that would push it left at common laptop or desktop widths.
- At 860px and below, navigation becomes a wrapped full-width row rather than overflowing or colliding with the brand; at 520px it receives reduced spacing and typography.
- The hero image has a bounded aspect ratio with `object-fit: cover`, while the layout uses `minmax(360px, 1.08fr)` on desktop and a single column on smaller screens.
- Production HTML contains `resource-site-header__nav` and `resource-home-hero`; the home output contains no `GAME RESOURCE CENTER` or breadcrumb element, while a child-page output contains the breadcrumb.

## Verification

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm run build` (including content validation and SEO audit) — passed

## Final result: passed

The reported P1 visual hierarchy issues are resolved, and the responsive breakpoints preserve readable navigation and a non-cropped primary message across desktop and mobile layouts.
