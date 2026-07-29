# SKILL.md — HINQ ZNO Design System

This skill teaches an agent how to design new screens and components for **HINQ's ZNO** product (a Dutch healthcare‑data‑exchange clinician web app, built on MUI v5.16.0).

Read this whenever you're asked to design, mock, or extend anything inside the HINQ / ZNO product surface, or to produce assets that need to feel native to it.

---

## What HINQ / ZNO is

- **Product**: a single clinician‑facing web app that aggregates patient records from many EHRs into one merged "network health dossier".
- **Users**: care professionals (huisartsen, specialists, apothekers, verloskundigen). Not patients, not consumers.
- **Tone**: clinical, calm, factual. Dutch and English; copy in the kit is English.
- **Tech ground truth**: MUI v5.16.0 with a HINQ theme override. When in doubt, the codebase wins over the Figma file.

---

## When to start a screen

1. Open `README.md` and re‑read sections **4 (Content)**, **5 (Visual)**, **6 (Icons)** — they're short.
2. Pull tokens from `colors_and_type.css` (`var(--hinq-primary-main)`, `var(--bg-default)`, `var(--font-display)`, `var(--radius-sm)`, etc). **Never** hardcode the hex `#0037E8` or fonts; always reference vars.
3. If you need a working component reference, copy from `ui_kits/zno-app/components/` — `AppBar.jsx`, `Sidebar.jsx`, `MedicalHistory.jsx` show the canonical layout, and `kit.css` has the chip/button/table/drawer recipes.

---

## Hard rules — do not break

| Rule | Why |
| --- | --- |
| **Sentence case for everything.** Buttons say `Request permission`, never `Request Permission`. Acronyms like `BSN`, `ZNO`, `ACP` stay caps. | The product copy and Figma type styles are entirely sentence case. |
| **No emoji, no exclamation points.** | Clinical tone. The codebase has zero emoji. |
| **No gradients, no photography, no textures, no backdrop blur.** | Surfaces are flat. The brand has no imagery system. |
| **No drop shadows on cards.** Cards are flat white paper on a lavender canvas. | Elevation is reserved for popovers (`elev-8`) and dialogs (`elev-24`). |
| **No third icon library.** Material Icons + the bespoke HINQ SVGs in `assets/icons/nav/` and `assets/icons/common/`. Substitute Material Icons for anything missing — never Lucide, Heroicons, Phosphor. | The production app is committed to MUI Icons. |
| **No coral CTAs.** Coral (`#FF6464`) is the logo accent **and** the error/warning token — that's it. Primary CTAs are royal blue. | The system reuses one color for two semantic roles; coral on a button reads as destructive. |
| **No pure white page background.** Use `var(--bg-default)` (the lavender). Pure white is for the cards on top. | Distinguishes ZNO from the bone‑white EHRs it aggregates. |
| **Use `text-transform: none` on buttons.** | Overrides MUI's default uppercase. The kit's `.btn` class already does this. |

---

## Layout skeleton for any new dashboard

```
<AppBar/>             ← 64px, sticky, white, 1px bottom border
<Sidebar/> + <main>   ← 240px persistent drawer pushes content (does not overlay)
  <div className="page">
    <div className="dashboard-head">      ← H1 + status chips + actions row
      <h1 className="h1">{title}</h1>
      <Chip variant="info-soft">…</Chip>
      <div className="spacer"/>
      <SourceStatus sources={…}/>         ← always show network sync state
      <Button …/>
    </div>
    <div className="tabs">…</div>          ← MUI Tabs with count badges
    <div className="paper flat">…</div>    ← table or stacked cards
  </div>
```

24px is the dominant rhythm: `gap: 24px` between major rows, `padding: 20–24px` inside cards.

---

## Spacing & radii cheat sheet

- Spacing scale (8pt): `--space-1: 8px` … `--space-8: 64px`. Inside cards, prefer 16/24. Between cards, 24.
- Radius: `--radius-sm: 4px` (cards, buttons, inputs, alerts), `--radius-pill: 16px` (chips), `0` (drawers, full‑bleed bars).
- Elevation: stay flat. Only use `--elev-8` on menus/popovers and `--elev-24` on dialogs.

---

## Components — pick from the kit, don't reinvent

The kit ships canonical implementations. Reuse the class names + JSX.

- **Button**: `.btn-contained` / `.btn-outlined` / `.btn-text`, sizes default + `.btn-sm`. Always sentence case, always `text-transform: none`.
- **Chip**: `.chip` + variant (`primary`, `error`, `success-soft`, `warn-soft`, `info-soft`, `outline`). Add a `<span class="dot">` for status pills.
- **Tabs**: `.tabs > .tab.active` with a count badge (`<span class="count">12</span>`). Active state is blue underline + bold + filled blue count.
- **Tables**: `.tbl` — header is `--bg-table-header` with rule above + below; row hover `--bg-hover`; selected row `--bg-selected`; trailing `<button class="icon-btn">` for the kebab.
- **Source status**: every aggregated dashboard MUST surface which networks responded. Use `<SourceStatus sources={…}/>` in the dashboard head — it shows `n/total sources` with spinner / cloud‑done / warning state. This is the most product‑specific pattern in ZNO.
- **Drawer**: 600px wide right‑hand sheet for record detail. Sharp 0‑radius edge against the viewport.
- **Empty state**: `.empty` with an `.icon-bg` (96px lavender circle) + an outlined `Material Icon` at 36px + h5 + b1 muted explainer + an outlined CTA. Never a full hero illustration unless it's first‑run.

---

## Copy patterns

- Page titles are nouns: `Personal data`, `Medical history`, `Access & sharing`. No verbs.
- Tab labels are short and case‑matched to the title: `Diagnoses & episodes (7)`, never `Diagnoses And Episodes`.
- Empty states: explain WHY data is absent and HOW to get it. Lift directly from `zno-client/src/lib/i18n/en/*.i18n.json` if a similar state exists.
- Chips for status are short — one or two words: `Active`, `In remission`, `Awaiting consent`. Dutch on patient‑data fields (Actief, Gestopt, Verlopen) is appropriate when mocking realistic clinical data.

---

## Realistic mock data tips

- Patient names: Dutch (Vermeer, de Vries, Bakker). BSN format: `123 456 789`.
- ICD‑10 codes for diagnoses (`I10`, `E11.9`, `M54.5`).
- Sources should be a mix: a GP practice, an academic hospital (AMC/UMC), a pharmacy, sometimes GGZ (mental‑health), sometimes LSP (the national exchange). It's normal for one source to be `inflight` and one to be `failed` — the network is unreliable by design.

---

## Final checklist before delivering a screen

- [ ] Sentence case throughout
- [ ] `var(--…)` tokens, no raw hex
- [ ] App bar + 240px sidebar + lavender canvas behind white cards
- [ ] Source status visible on any aggregated dashboard
- [ ] Material Icons or `assets/icons/nav|common/*.svg` only — no other icon library
- [ ] No emoji, no gradients, no photography, no shadows on idle cards
- [ ] At least one realistic Dutch‑clinical detail (BSN, ICD code, GP practice name) so it reads as in‑product, not generic
