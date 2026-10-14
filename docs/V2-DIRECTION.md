# UNIVO V2 — «Проекции» (Projections)

Branch: `concept/univo-v2`. V1 stays on `main`, untouched.

## A. Concept in one paragraph

V2 draws UNIVO the way an architect draws a building: in **projections**. The group is a structure
with floors — the masterbrand on top, directions on one floor, products on the next, an empty dashed
floor for what comes after. One axis (the line) runs through all of them, starting from one point (the
Tangerine source). Every page shows the same structure in a different projection: the **axonometric**
view on Home (the whole at a glance), the **exploded** view on Ecosystem (how it is put together),
the **section** with load-bearing columns for the standards (what holds every floor), the **elevation**
of a qualification for About (how a business gets in), and the **entrance** on Contact (one way in).
Line and point stop being ornaments and become what they are in any drawing: the minimum means of
construction.

## B. Why it is different from V1

| | V1 | V2 |
|---|---|---|
| Space | flat, editorial, one plane | spatial: depth, floors, layers, projections |
| Line | a drawn stroke (wave, axes, routes) on every section | an axis *inside* a structure; often implied by alignment |
| Ecosystem | lists and maps of names | a building you read at a glance, then take apart |
| Standards | five horizontal lines | five load-bearing columns through every floor |
| Signature | typography + stroke | an architectural model of the group |
| Composition | heading → graphic sections | drawing sheets: model + callouts + legend + title block |

V2 reuses content, tokens, Onest, i18n, forms and data — no V1 section composition.

## C. Brand connection

- **One point** — the source above the top floor (Tangerine); each member's node on its floor (its colour).
- **One line** — the axis that passes through every floor at the **shared edge** of its two parts
  (Brand Book p. 28: «общий край» — blocks share one border). The standard runs exactly where the parts meet.
- **System** — floors, levels, projections: the same structure, read in different ways.
- **Clarity** — callouts and legends, like a drawing: every element is named.
- **Responsibility** — one entrance; one route; one owner (Contact, workflow).
- **Result** — the point on the ground line: the moment the structure is used.
- **Long-term** — the empty dashed floor: the structure is built to grow.
- Brand forms used: the **arch** (Contact entrance), shared edges, round-capped line, the dot. Onest only.

## D. Visual language

- **Typography:** Onest 400/500/600. Fewer giant headlines than V1. Display only for the Home and About
  statements; everything else at H1/H2 with tight tracking. Small tabular "drawing" labels (sentence case).
- **Surfaces:** Paper dominates (Brand Book: master = light). White = drawing sheets. Ink = depth moments
  (plan of the floors, qualification, ending).
- **The model:** isometric SVG (30°), slabs with a white top, two shaded faces (Line / darker neutral),
  1.25 px Ink edges. No blur shadows, no gradients, no glass.
- **Composition:** drawing-sheet logic — model, callout leaders, legend, title block (entity, type,
  status, market). Shared edges instead of gaps.
- **Density:** Hero expressive; Standards technical; Plan dense/dark; Entrance explanatory; ending quiet.
- **Grid:** 12 columns, same margins as V1; callouts align to grid columns, not to the model.
- **Nodes:** filled = live, ring = launching, dashed = next. Entity colour only on nodes and short leaders.
- **Routes:** the axis; leader lines; the qualification path; the entrance route.

## E. Motion philosophy

Motion shows **construction**: the point appears, the axis descends, floors settle onto it — the system
is assembled, not decorated. Precise, slightly mechanical easing (in-out), no bounce, nothing idle.

- Hero: point → axis → floors (one sequence, once).
- Hover / focus on a member: its floor tints, its node and leader light up in its colour.
- Ecosystem: the model is shown exploded; floors separate along the axis on entry.
- About: the business point travels down through the gates as you scroll (progressive enhancement,
  final state shown without support / with reduced motion).
- Contact: choosing a direction lights its floor in the small model — the route of the task.

Tokens: fast 160 ms · standard 320 ms · deliberate 640 ms · page 900 ms · stagger 90 ms;
easing `cubic-bezier(0.2,0,0,1)` (out) and `cubic-bezier(0.65,0,0.35,1)` (construct).
Reduced motion: final state immediately, no information depends on sequence.

## F. Storyboard

**Home** — 1) Hero: statement left, axonometric model right with callouts (signature 1). 2) Plan
(Ink): the two floors seen from above — directions and products as plates sharing an edge, dense.
3) Section (White): five load-bearing columns through every floor, with rule/check (signature 2).
4) Entrance: one way in — the arch and four steps of the route. 5) Ending + footer on the ground line.

**Ecosystem** — 1) Exploded model with full callouts (type, status, market) (signature 3).
2) Drawing sheets per member with a title block: TECH capabilities grid, PRODUCTION process,
RETAIL movement of goods, SLOT time axis. 3) How the parts work together. 4) Ending.

**About** — 1) Statement + ground line + point. 2) Masterbrand callouts. 3) «Работа сделана, когда ею
можно пользоваться» — the point lands on the ground line. 4) Qualification elevation: the business
point passes four gates to the UNIVO floor (signature 4). 5) Standards as rule → check. 6) Character.

**Contact** — the entrance arch holds the form; a small model shows where the task will go;
«Пусть UNIVO определит» keeps the route at the master floor.

## G. Mobile

The model is vertical by nature (floors) — it keeps its 3D on phones, callouts become a numbered
legend below the drawing. The section view becomes a stack of standards with a mini column diagram.
The plan becomes stacked plates. Qualification is a vertical path already. Contact: the arch becomes a
top-rounded frame for the form; the small model moves above it. No hover dependencies — touch shows
member colours at rest.

## H. What V2 intentionally avoids

Glassmorphism, gradients, glow, blobs, particles, WebGL, cursor followers, magnetic buttons, scroll
hijacking, horizontal scroll, marquees, loaders, fake UI/dashboards/terminals, tech-logo orbits,
"design tool" overlays, fake metrics or clients, giant type everywhere, generic fade-up on every section,
cards with radius and shadow, rainbow sections.
