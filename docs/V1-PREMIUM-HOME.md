# UNIVO V1 — premium Home upgrade

Branch `upgrade/univo-v1-premium-home` (from `main` @ fa30fa7). Scope: Home only (+ Home ending / footer
variant). V2 / V2B are archived experiments and are not reused.

## 1. Audit — the five weakest moments of the current V1 Home (browser, 1440 / 390)

1. **Hero stroke.** One heavy, uniform black stroke carries the whole screen. Its hierarchy is inverted:
   the UNIVO source dot sits *lowest*, TECH highest. Headline, lead and graphic are three unrelated
   zones; the labels are a flat row under the stroke. Bold, but not premium — it reads as an illustration.
2. **Standards weave.** A 5 × 4 grid of identical rows, tinted verticals and black dots: a spreadsheet.
   Rule and check text are squeezed into narrow columns; nothing shows *a check being applied*.
3. **Ecosystem index.** Good typography, no behaviour: hover only moves an arrow. The Ink surface has no
   reason except alternation, and the relation of each part to UNIVO is not shown.
4. **Workflow racetrack.** A switchback pipe around four table rows. The real example (TECH + PRODUCTION)
   floats loose at the side; "UNIVO decides the route" is told, not shown.
5. **Ending + footer.** Giant headline again, a long line to a button, then a giant cropped wordmark —
   the same big-type formula a fourth time, closing heavily instead of signing off.

Across the page: every section is *heading + paragraph + line*; one rhythm, one density, from top to bottom.

## 2. Art direction — "the system in states"

Line and point stay the grammar. A second layer is added: **digital system behaviour** — every main
visual has an idle state, an active state and a relationship to the UNIVO source.

- **One recurring geometry.** The arch (the *n* of the wordmark, turns only by semicircles) and the
  source point. Hero arches → index spine → route turns → footer mark: the same stroke, re-used with
  intent rather than repeated as ornament.
- **Source first.** UNIVO is always the origin of the line: hero centre, top of the index spine, the
  router of the route, the dot of the closing mark.
- **Depth by layering, not effects.** Stroke weight by rank (master > directions > products > next),
  foreground/background, overlap, one White plane over Paper, Ink as the "inside" of the system.
- **States.** Focus/hover activates one entity: its node grows, its path from UNIVO takes its colour,
  the rest stays visible at lower contrast. Colour = identity signal only.
- **Rhythm.** Statement (hero, open) → dense dark layer (inside: index) → open control (standards)
  → compact system (route) → short dark signature (end + footer).
- **Type.** Display only in the hero. Section titles at H1/H2, statements set narrower; labels small.

## 3. Home sequence

| # | Section | Surface | Role | Signature |
|---|---|---|---|---|
| 1 | Hero — source and arches | Paper | statement + structure | **#1** |
| 2 | Index — inside the group | Ink | dense, interactive | — (strong state behaviour) |
| 3 | Standards — operating checks | White | open control | **#2** |
| 4 | One point of entry — routing | Paper | compact system | **#3** |
| 5 | Ending + footer signature | Ink | quiet close | — |

## 4. Orbit / ecosystem experiment

Idea: UNIVO as central source, the parts on structured trajectories. Interpreted through the brand:
the trajectories are **arches of the wordmark's *n*** standing on one baseline around the source point
— inner arch for directions, outer for products, dashed for the next part. Rejection rule: if it reads
as a solar system / signal icon, it is dropped in favour of a refined stroke. (Result recorded in §6.)

## 5. Motion plan (foundation only — no library, no GSAP)

| Section | Idle | Entrance | Hover / focus | Scroll | Reduced motion |
|---|---|---|---|---|---|
| Hero | full system shown | point → arches draw outward → nodes resolve | node grows, its arch segment takes its colour | — | final state |
| Index | spine + all parts | names rise in tier order | row active, spine segment from UNIVO in colour, others quieter | — | final state |
| Standards | first check selected | checks tick across parts | select = checks re-tick | — | final state, no tick |
| Route | first example routed | route draws from task to result | choose task → route redraws | — | final state |
| Ending | — | — | button arrow nudge | — | — |

## 6. Decisions log

(filled in while building)
