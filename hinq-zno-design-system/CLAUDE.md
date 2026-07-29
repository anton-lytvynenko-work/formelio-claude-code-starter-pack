# Project context — HINQ ZNO Design System

You are working in a project that follows the **HINQ ZNO** design system. The full system lives in `hinq-zno-design-system/` at the repo root. Read it before designing or modifying any UI.

## What's in `hinq-zno-design-system/`

```
hinq-zno-design-system/
├── README.md              ← Brand voice, color usage, copy rules, dos & don'ts
├── SKILL.md               ← Concrete component recipes & layout patterns
├── colors_and_type.css    ← All design tokens (CSS custom properties)
├── fonts/                 ← Open Sans (body) + Montserrat (display) — self-host
├── assets/
│   ├── icons/nav/         ← Module navigation icons (24×24, currentColor)
│   ├── icons/common/      ← Content icons (currentColor)
│   ├── illustrations/     ← Empty-state line illustrations
│   └── hinq_logo.svg
├── preview/               ← Reference HTML pages — open in a browser to SEE every token & component rendered
└── ui_kits/zno-app/       ← Working React reference implementation (kit.css + components/*.jsx)
```

## Hard rules — apply to every UI change

1. **Tokens, not literals.** Pull every color, radius, shadow, spacing and font from `colors_and_type.css` (`--hinq-primary-main`, `--fg-1`, `--bg-paper`, `--radius-sm`, `--elev-1`, …). Never paste hex codes inline. If a token is missing, add it to the CSS file — do not invent ad-hoc values.

2. **Components, not lookalikes.** When a primitive already exists in `ui_kits/zno-app/components/` (`Button`, `Chip`, `Icon`, `Drawer`, `AppBar`, `Sidebar`, `SourceStatus`, etc.), use it. Match its API exactly. Do not duplicate styles in another file.

3. **Sentence case everywhere.** Buttons, tabs, page titles, chips: `Request permission`, `Medical history`, `Awaiting consent`. Never `Request Permission`. Acronyms stay capitalized (`BSN`, `ZNO`, `ACP`).

4. **Dutch on patient-data fields, English on chrome.** `Actief / Gestopt / Verlopen` stay Dutch. `Reload all sources / Request access` stay English. See `README.md` § "Voice & language".

5. **Empty states are a system.** `.empty` container · 96px lavender `.icon-bg` · 36px outlined Material icon · h5 line · b1 muted explainer · outlined CTA. Lift wording from `zno-client/src/lib/i18n/en/*.i18n.json` if a similar state exists; otherwise see the canonical strings in `README.md`.

6. **No emoji. No gradients. No drop shadows beyond the elevation tokens.** A handful of flat, single-weight (1.5px stroke, primary blue) line illustrations exist — see `assets/illustrations/`. Use those, don't invent new ones.

7. **Iconography:** Material Icons Outlined as the base set; bespoke HINQ glyphs only for the module-nav icons in `assets/icons/nav/`. All icons render in `currentColor` — no embedded fills, no background circles. Sizes stay on the 16 / 20 / 24 / 35 / 60 scale.

8. **Status chips are short.** One or two words. The associated date or detail goes adjacent (muted, smaller), not inside the chip — chips don't wrap. Pattern: `<Chip>Gestopt</Chip>` + `<span class="meta">per 2023-04-12</span>` stacked.

9. **Tabs follow MUI Tabs.** 48px tall, 2px primary indicator, `rgba(0,55,232,0.04)` hover overlay on inactive, count chip is a 20×20 mono badge. See `preview/components-tabs-nav.html`.

10. **Layout scaffold is fixed:** `AppBar` (top) + `Sidebar` (left, collapsible) + `<main><Container maxWidth="xl">`. No marketing-style heroes. No full-bleed imagery in the app.

## Workflow when adding or changing a screen

1. **Read first.** `hinq-zno-design-system/README.md` end-to-end for voice and visual rules. `hinq-zno-design-system/SKILL.md` for the layout pattern that matches what you're building (dashboard, detail drawer, table, empty state, etc.).
2. **Open the relevant preview** in `hinq-zno-design-system/preview/` so you can see the live token/component behavior before writing code. The preview pages are the source of truth for visual fidelity.
3. **Reuse before extending.** Search `ui_kits/zno-app/components/` for an existing primitive. If you must extend one, edit it there — do not fork.
4. **Diff against the preview.** Before declaring a change done, compare the rendered screen against the equivalent preview page. Spacing, typography weight, chip casing, hover states — all must match.

## When the user gives feedback like "this looks off"

Don't guess colors or padding. Open the matching preview, identify which token / component is being violated, and fix the underlying violation rather than tweaking values to "look right". If a real gap exists in the design system (missing token, missing variant), surface it — don't paper over it.

## Things you must NOT do

- Add new color values, font families, or radius scales without first updating `colors_and_type.css`.
- Use `border-width` changes or padding shifts for focus/hover states (causes layout jump). Use `box-shadow: inset …` instead.
- Title-case anything user-facing.
- Use emoji, gradient backgrounds, or generated-looking illustrations.
- Create a marketing-style landing page inside the app — ZNO is a clinical tool, not a brochure.

If something the user asks for genuinely conflicts with this system, flag the conflict and propose the closest in-system alternative before proceeding.
