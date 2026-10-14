# UNIVO — art direction v2 ("The Stroke")

## Diagnosis of v1

| Problem | Where it showed |
|---|---|
| One formula everywhere: uppercase label → heading → paragraph → hairline | every section of every page |
| Document layout: heading left / text right / divider | About (5 rows), Home "What is UNIVO" |
| Ecosystem = cards; rename the heading to "Services" and nothing breaks | Home panels, Ecosystem blocks, product boxes |
| Line and dot = punctuation and one vertical list | hero list, one process line |
| One volume: paper + same type sizes from top to bottom | all pages |

## Concept

UNIVO's own letterform is the system. In the logo, **u and n share one stroke** and the
**dot sits over the shared stem**. The Brand Book (p. 7): *"a new direction does not get a new logo —
it is added to the masterbrand, the way n is added to u."*

So the group is drawn as **one continuous stroke in the logo's geometry**: a source stem with the
Tangerine dot, then the stroke continues — u, n, u, n — and every crest carries one member's dot.
A new direction or product = one more crest. Same stroke weight ratio (w), same radius (1.5w),
same dot (1.5w, gap 0.5w) as the wordmark. Turns only by semicircles (Brand Book p. 29).

SOURCE (Tangerine stem) → PATH (the stroke) → NODE (crest dot) → DIRECTION (dot colour) → RESULT

Dot grammar: filled = live · ring = launching · Tangerine = UNIVO / the result · direction colour = who speaks.

## Keep / modify / replace

- **Keep:** routes, proxy, i18n plumbing (typed dictionaries, KY fallback), ecosystem data model,
  lead validation + staging delivery, SEO/staging, a11y foundations (skip link, dialog menu, focus).
- **Modify:** tokens (surfaces, statement/mega type, entity accent vars), header (dot = "you are here",
  scroll progress line), forms (field styling, order), LineDot → Line/Dot primitives.
- **Replace:** every section composition, cards, footer (→ one dark "end of system" with CTA and the
  wordmark as the final node), About rows, Contact layout.

## Page roles (volume)

| Page | Entry | Loud moment | Dense moment | Quiet moment |
|---|---|---|---|---|
| Home | Paper, headline + group stroke | stroke supergraphic | Ink ecosystem index | — |
| Ecosystem | Paper, stroke as specification map | direction lockups | TECH matrix / PRODUCTION pipeline | — |
| About | Ink, symbol stroke | "Работа сделана…" statement | standards spec | character |
| Contact | Paper, form on a route | — | — | everything: one job |

## Motion foundation (no final motion yet)

- Strokes are single SVG `<path pathLength="1" data-route>` → draw via dash offset later.
- Nodes are separate `<circle data-node="tech">` / HTML dots → grow, activate.
- Text wrapped in `.reveal > .reveal__inner` (overflow mask) where a type reveal is planned.
- Sections carry `data-surface` / `data-scene` so a scroll layer can address them.
- `prefers-reduced-motion`: final state, nothing to wait for. No animation library installed.

## Pass 2 — refinement (14.10.2026)

### Direction colours (owner decision, supersedes Brand Book v1.2.2 division colours)

| Entity | Colour | Use |
|---|---|---|
| UNIVO | Tangerine `#FF5F1F` (Brand Book) | source, result, master dot |
| TECH | `#16A36A` | dots, nodes, short segments, hover — never text, never surfaces |
| PRODUCTION | `#E5483F` | same |
| RETAIL | `#3558D4` | same |
| SLOT | `#17A8D1` | same (2.7:1 on Paper — identity only, like the master dot) |

Note for the audit: TECH green and SLOT cyan sit near the Brand Book's success/info state colours.
States therefore always carry icon + text.

### One language, different behaviour of the line

| Where | Meaning | Geometry |
|---|---|---|
| Home hero | identity | skyline: source stem + arches; height = status, wider valley between groups |
| Home standards | shared axis | five straight 3 px axes piercing every member node; dashed end = next member |
| Home ecosystem index | membership | one vertical thread through dots; hover draws a short colour segment |
| Home workflow | task route | low switchback (136 px pitch), stages scan left-aligned |
| Ecosystem map | architecture | straight master line, members hang on stems (junctions, no curves) |
| TECH | system | capability grid, nodes on intersections, green top rule |
| PRODUCTION | process | script → shoot → edit, red end node |
| RETAIL | movement | warehouse → stock → branches → sales flow + control ledger |
| SLOT | time | axis of slots, booked / free |
| About why | merge | four colour lanes end at one axis; one thick standard line continues |
| About standards | verification | rule → connector → check node per standard |
| About qualification | filter | ring → four gates → Tangerine dot |
| Contact | entry | vertical route from entry ring through the form to the button |

### Motion foundation (no final motion yet)

`html.motion` is set before paint only without reduced motion (fail-safe 2.5 s). `MotionRoot` marks
`[data-scene]` with `data-in` once. CSS: `.reveal__inner` rises, `path[data-route]` draws by dash offset,
`svg circle[data-node]` grows in order, `[data-draw]` CSS lines reveal via clip-path. Hover/focus:
node activation in member colour (standards, index, map, TECH grid), arrow nudge, underline segments.
