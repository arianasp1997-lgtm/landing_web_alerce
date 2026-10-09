# DESIGN.md — Equipo Alerce

Design system specification for AI coding agents and human designers building and iterating on Equipo Alerce interfaces.

---

## 1. Visual Theme & Atmosphere

- **Archetype**: Warm Editorial Consulting & Pragmatic Technology.
- **Mood**: Authoritative yet deeply empathetic; human-centered, grounded, and clear. Avoids cold corporate SaaS tropes (gradient blobs, generic purple cards, floating illustrations) in favor of physical print quality, high-contrast editorial typography, and structured gridlines.
- **Density**: Spacious editorial pacing. Generous vertical breathing room between sections, sharp typographic hierarchy, and prominent numbered indexes.
- **Key Motifs**:
  - Warm paper surfaces (`#F3F0E8`) rather than stark digital white.
  - Visible architectural gridlines (`.lined`) inspired by financial ledgers and editorial journals.
  - Dynamic contrast between botanical forest green (`#0F3B2C`) and high-voltage acid lime (`#D2F26B`) as an energetic accent.
  - Kinetic highlighter sweeps (`.mark`) and animated strike-through states illustrating transition from operational chaos to order.

---

## 2. Color Palette & Roles

### Base System (Warm Paper & Inks)
| Token | Hex | Role | Usage |
|---|---|---|---|
| `--color-paper` | `#F3F0E8` | Canvas base | Primary page background, light canvas |
| `--color-paper-2` | `#E9E5D9` | Canvas subtle | Secondary section backgrounds, panel fills |
| `--color-card-light` | `#FBFAF6` | Surface light | Floating card background, crisp clean containers |
| `--color-ink` | `#0D1A14` | High-contrast ink | Headlines, primary text, prominent buttons |
| `--color-ink-soft` | `#33403A` | Body ink | Subtitles, editorial copy, primary paragraphs |
| `--color-muted` | `#5E6862` | Secondary ink | Microcopy, labels, step descriptions |
| `--color-line` | `#D5CFBF` | Structural line | Section rules, gridlines, card borders |

### Brand Deep Greens (Forest & Night)
| Token | Hex | Role | Usage |
|---|---|---|---|
| `--color-forest` | `#0F3B2C` | Brand Primary | Dark cards, marquee background, button hovers |
| `--color-forest-deep` | `#0A2A1F` | Deep Ground | Diagnostic section canvas, footer background |
| `--color-forest-line` | `#24503F` | Dark Border | Borders inside deep green & dark cards |

### Accents & Semantic States
| Token | Hex | Role | Usage |
|---|---|---|---|
| `--color-acid` | `#D2F26B` | High Voltage Accent | CTAs, selection highlights, active indicators |
| `--color-acid-hover`| `#E0F98F` | Accent Hover | Hover state on acid buttons |
| `--color-acid-deep` | `#B9DC45` | Focus ring | Keyboard focus outlines, active borders |
| `--color-strike` | `#B4442F` | Friction / Warning | Strikethrough lines, error alerts, problem tags |

---

## 3. Typography Rules

### Font Families
- **Display & Quotes**: `Instrument Serif` (`font-serif`, `font-display`)
  - Usage: H1 titles, H2 editorial statements, large quotation marks, metric numerals (`01`, `02`).
  - Style: Regular & Italic (`em`).
- **Interface & Body**: `Geist` (`font-sans`)
  - Usage: Subheadlines, body copy, navigation links, form labels, buttons.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).
- **Metadata & Technical Data**: `Geist Mono` (`font-mono`)
  - Usage: Eyebrow tags, section indices (`01 / Situaciones`), step numbers, tags, timestamps.
  - Tracking: `tracking-wider` to `tracking-widest` (all uppercase).

### Hierarchy Scale
```
H1 (Hero):        text-5xl (48px) → sm:text-6xl (60px) → lg:text-[76px] | line-height: 1.02
H2 (Section):     text-4xl (36px) → sm:text-5xl (48px) → lg:text-6xl (60px) | line-height: 1.05
H3 (Card/Title):  text-xl (20px) → sm:text-2xl (24px) | font-semibold or font-bold
Body Large:       text-lg (18px) → sm:text-xl (20px) | font-normal | text-[#33403A]
Body Regular:     text-base (16px) | line-height: 1.6 | text-[#33403A]
Eyebrow/Tags:     text-xs (12px) | font-mono | uppercase | tracking-wider
Footnote/Meta:    text-[11px] (11px) | font-mono | text-[#5E6862]
```

---

## 4. Component Stylings

### Buttons
All buttons follow a refined pill silhouette (`rounded-full`) with a nested circular arrow pill (`.btn-arrow`):
- **Primary Pill** (`.btn .btn-primary`):
  - Background: `#0D1A14` (Ink)
  - Text: `#F3F0E8` (Paper)
  - Arrow disc: `#D2F26B` (Acid) with `#0D1A14` icon
  - Hover: Background transitions to `#0F3B2C`; arrow rotates -45° and nudges right.
- **Acid Pill** (`.btn .btn-acid`):
  - Background: `#D2F26B` (Acid)
  - Text: `#0D1A14` (Ink)
  - Arrow disc: `#0D1A14` (Ink) with `#D2F26B` icon
- **Outline Pill** (`.btn .btn-outline`):
  - Background: transparent; border: `1px solid rgba(13,26,20,0.22)`
  - Text: `#0D1A14`
  - Hover: fills with `#0D1A14` and text inverts to `#F3F0E8`.

### Before → After Comparison Card (`.ba-card`)
- Outer container: rounded `1.75rem`, light paper `#FBFAF6`, subtle diffused elevation.
- Upper panel (`.ba-before`): `#E9E5D9`, strikethrough red tags (`#B4442F`) showcasing real operational bottlenecks.
- Center switch badge: round pill with acid lime arrow pointing downward.
- Lower panel (`.ba-after`): deep forest `#0F3B2C`, vibrant acid checks, white text displaying tangible outcomes.

### Numbered Editorial Rows (`.sit-row`)
- Two-column grid (`3.25rem 1fr`).
- Number badge (`.sit-num`): Monospace pill with border `#D5CFBF`.
- On hover: number pill turns `#D2F26B`, row indents smoothly `+0.75rem` to the right.

### Service Grid (`.svc-grid`)
- 1px gridline aesthetic (`gap: 1px; background: var(--color-line)`).
- Normal cells (`.svc-cell`): paper background, rotating icon badge on hover.
- Featured cell (`.svc-cell-dark`): forest green background `#0F3B2C`, acid tag for AI & automation with human control.

### Interactive Diagnostic Step Card (`.diag-card`)
- Dark forest backdrop `#0A2A1F` with glowing acid progress bar (`.diag-progress-fill`).
- Option buttons (`.diag-option-btn`): dark slate background, monospace letter avatar (`A`, `B`, `C`), subtle hover shift.
- Selected state: acid border `#D2F26B` with emerald translucent fill.

---

## 5. Layout Principles

- **Frame Bounds**: Max width of `1280px` (`.frame`), with `1.5rem` (mobile) to `2.5rem` (desktop) horizontal padding.
- **Visible Gridlines** (`.lined`): Thin `1px` vertical rules at page edges and center dividing line on large viewports (`rgba(13,26,20,0.08)`).
- **Section Dividers** (`.section-rule`): Clean solid horizontal line capped with monospace section numbers (`01 / Situaciones`, `02 / Qué hacemos`) and descriptive right-hand labels.
- **Infinite Marquee**: Edge-to-edge overflow, masked with linear gradient fade on sides, running at `38s` continuous speed, paused on `:hover`.

---

## 6. Depth & Elevation

- **Elevation Philosophy**: Minimalist flat & tactile. Depth is achieved via color contrast and layered panels rather than heavy drop shadows.
- **Card Shadow**: `0 30px 60px -30px rgba(13, 26, 20, 0.25)` — ultra-soft ambient occlusion.
- **Diagnostic Shadow**: `0 40px 80px -40px rgba(0, 0, 0, 0.6)` on dark sections.
- **Z-Index Layering**:
  - `z-50`: Fixed Header (`backdrop-blur-md`)
  - `z-40`: Modal Drawers & Floating Controls
  - `z-10`: Interactive content & diagnostic steps
  - `z-0`: Background gridlines & watermark typography

---

## 7. Do's and Don'ts

### DO
- **DO** use `Instrument Serif` exclusively for large headlines, italic emphasis, and pull-quotes.
- **DO** write copy with humility, empathy, and practical business common sense ("Si se resuelve con una planilla existente, te diremos eso").
- **DO** use the acid lime accent (`#D2F26B`) selectively as an intentional focal point (CTAs, checks, badges), never as full-page background.
- **DO** respect `prefers-reduced-motion` for all marquee tracks, animations, and hover transitions.
- **DO** keep the diagnostic questionnaire as the primary conversion funnel (leads to CRM), with WhatsApp as secondary.

### DON'T
- **DON'T** use pure black (`#000000`) or cold corporate blues (`#2563EB`). Always use `#0D1A14` and `#0F3B2C`.
- **DON'T** use standard SaaS illustrations, 3D floating icons, or stock photo corporate handshakes.
- **DON'T** write generic buzzwords like "transformación digital 360", "sinergia disruptiva" or "soluciones holísticas".
- **DON'T** add generic popup overlays, spinners, or persistent floating banners that block reading.

---

## 8. Responsive Behavior

- **Mobile (< 640px)**:
  - Header collapses to branded logo and hamburger icon triggering clean drawer.
  - Before/After card stacks cleanly with full-width action buttons.
  - Situations list stacks number above quote.
  - Hero headline scales down to `text-5xl (48px)`.
- **Tablet (640px - 1024px)**:
  - Situations render in 2-column balanced grid.
  - Service grid switches to 2 columns.
- **Desktop (>= 1024px)**:
  - Full navigation menu visible.
  - Multi-line editorial gridlines activated across layout margins.
  - Service grid renders in 3-column layout with 2-column wide featured AI card.

---

## 9. Agent Prompt Guide

When asking an AI agent to build a new page, component, or email for Equipo Alerce, copy and paste this prompt:

```text
Act as a senior editorial designer building UI for Equipo Alerce (consultoría de procesos, datos y tecnología práctica para pymes).

Follow the DESIGN.md specifications:
- Base canvas: Warm paper (#F3F0E8). Text: Dark Ink (#0D1A14) for titles, Soft Ink (#33403A) for body.
- Brand Deep: Forest green (#0F3B2C), Deep canvas (#0A2A1F).
- Accent: Acid lime (#D2F26B) for high-impact CTA pills and active highlights.
- Typography: 'Instrument Serif' for big titles, metrics, and italic quotes; 'Geist' for UI and body text; 'Geist Mono' for eyebrow tags and numbers (01 / Tag).
- Aesthetic: Editorial, high-contrast, visible gridlines (.lined), rounded-full pill buttons with animated circle arrow (.btn-arrow).
- Tone: Pragmatic, honest, professional, empathetic. No corporate jargon or generic SaaS fluff.
```
