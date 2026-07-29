# HINQ ZNO Design System

> Design system for **HINQ's ZNO** (Zorgnetwerk‑Omgeving / "Healthcare Network Environment") — a Dutch health‑data exchange product that lets care professionals see a merged longitudinal record for one patient across many disconnected source systems.

---

## 1 · Company & Product Context

**HINQ** is a Dutch health‑tech company. Its flagship product is **ZNO** — a clinician‑facing web app that aggregates health information from multiple Electronic Health Records (EHRs) and source systems into a single "network health dossier" for a given client/patient.

The user logs in, picks a client, and sees one merged view of:

- **Personal data** — administrative, treatment directives, social context
- **Medical history** — diagnoses & episodes, encounters, procedures, observations, reports
- **Medication** (incl. medication control workflow)
- **Lab results, measurements, lifestyle**
- **Allergies & vaccinations**
- **Maternity** (pregnancy, ultrasound, birth, transfer to JGZ)
- **Chronic care** (COPD, U‑Prevent, care plans, exacerbation action plans, positive‑health radar)
- **ACP** — Advance Care Planning forms
- **Permissions / consent** management between organizations
- **Communication** (network chat between practitioners)
- **Tasks, alerts, referrals, documents**

The app is built on **MUI v5.16.0**. The Figma file is explicitly named `Design system HINQ ZNO (MUI v5.16.0)` — MUI is the framework, this design system is the HINQ skin on top of it.

### Surfaces represented

There is **one** clinician‑facing product (ZNO web app). Sub‑contexts inside it (Maternity, ACP, Chronic Care) reuse the same chrome but scope down to specific use‑cases. The only auth‑adjacent surfaces are an employee‑ID step‑up screen and the welcome/home screen. There is no marketing site, no consumer‑facing app, and no native mobile app inside the materials provided.

---

## 2 · Sources

| Source | Path / Link | Status |
| --- | --- | --- |
| Front‑end codebase (production) | `zno-client/` (mounted via File System Access) | Read‑only — used as source of truth |
| Figma design system file | `Design system HINQ ZNO (MUI v5.16.0).fig` (mounted as VFS) | Read‑only |
| Localization (English) | `zno-client/src/lib/i18n/en/*.i18n.json` | Used to derive copy/tone |
| MUI theme | `zno-client/src/lib/theme/{palette,typography,components}.mui.ts` | Source of truth for tokens |

If discrepancies between Figma and codebase appear, **the codebase wins** (MUI best practice + per the user's note).

---

## 3 · Index of this folder

```
README.md                  ← you are here
SKILL.md                   ← cross‑compatible with Claude Code Agent Skills
colors_and_type.css        ← all tokens (color, type, spacing, radius, elevation)

assets/
  hinq_logo.svg            ← primary logotype (royal blue + coral accent)
  favicon.png              ← raster favicon
  icons/nav/*.svg          ← 16 module icons (Personal, Medication, Lab, Maternity, …)
  icons/common/*.svg       ← 9 inline content icons (allergies, drugs, vaccine, …)
  icons/sidebar.svg        ← header "menu" icon
  illustrations/*.svg      ← onboarding/empty‑state illustrations

preview/
  *.html                   ← cards rendered in the Design System tab

ui_kits/
  zno-app/                 ← the only product surface — clickable patient‑record prototype
    README.md
    index.html
    components/*.jsx
```

---

## 4 · Content Fundamentals

ZNO copy is **clinical, calm, and patient‑directed**. It speaks to busy practitioners who need facts on screen, not flair.

### Voice

- **Second person, professional register.** "Try requesting permission from other organizations for a complete overview." The user is a practitioner; the patient is referred to as **"client"** or **"patient"** (both appear; "client" is preferred in newer screens).
- **No first person.** No "we'll" / "let's". The system narrates state, it doesn't befriend the user. Exception: short status sentences from the system itself — "We couldn't find a pregnancy episode."
- **Imperatives for actions.** "Request access", "Reload all sources", "Adjust your general filters". No "Click here", no exclamation marks.
- **Reassuring on slow loads.** `"It's taking a bit longer, we're retrieving the data"` — the only time the system uses "we".

### Casing

- **Sentence case everywhere.** Buttons: `Request permission`, `Reload all sources`. Page titles: `Personal data`, `Medical history`. Tabs: `Treatment directives`. **Never** Title Case Like This.
- Acronyms stay capitalized: `BSN`, `ZNO`, `ACP`, `JGZ`, `COPD`.

### Punctuation & numerals

- Periods on full sentences, none on labels. `Loading`, `No data available`, but `It's taking a bit longer, we're retrieving the data`.
- Counts inline in parentheses on tabs: `Procedures (12)`. Never with a colon.
- **No emoji**, anywhere. Not in copy, not in alerts, not in success states.
- **No ALL‑CAPS** for emphasis. Use the `subtitle1` weight (600) instead.

### Tone examples (verbatim from `generic.i18n.json`)

| Situation | Copy |
| --- | --- |
| Welcome | `Welcome to the Healthcare Network Environment (ZNO)` |
| Empty (no data) | `No data was found in the resources you have access to.\nTry to retrieve data from another healthcare provider.` |
| Empty (filtered out) | `We couldn't find any data. Adjust your general filters or try requesting access from other organizations via 'Access' in the menu.` |
| Slow loading | `It's taking a bit longer, we're retrieving the data` |
| New version | `Refresh page to use the newest version of the ZNO` |
| Palliative chip tooltip | `Healthcare providers wouldn't be surprised if the patient died within 12 months. Advance Care Planning is essential.` |

The last one is characteristic: ZNO talks about death matter‑of‑factly, because clinicians do. Don't soften medical language.

### What to avoid

- ❌ Marketing flourish — "Unlock the power of…", "Empower your team…"
- ❌ Emoji, exclamation points, "!"
- ❌ Title Case
- ❌ "Click here", "Tap to…"
- ❌ Apologies — "Oops!" / "Sorry, something broke!" → use the system message: `Something went wrong`

---

## 5 · Visual Foundations

### Color

- **Primary is one royal blue: `#0037E8`.** It carries the entire interface. It's used on contained CTAs, the active nav item, links, focus rings, the logo wordmark, the avatar of the practitioner side of chat, and the small wedge inside the HINQ logo mark.
- A **coral red `#FF6464`** appears in exactly two places: (a) inside the HINQ logo mark, (b) as the `error.main` / `warning.main` token. Yes, error and warning share a color in the source palette — this is intentional in MUI's setup but a known weak point; treat warning as a softer surface treatment (light fill on white) and error as a stronger one (filled chip on white).
- A **secondary purple `#9D5E97`** is quiet — it shows up as an avatar color for the "patient" side of conversation, occasional badges, and as the lavender tint of the app canvas (`#F6F2F7`). It is **not** used on CTAs.
- Status colors are MUI defaults: info `#19A5F1`, success `#51B277`, error `#FF6464`. All have a 50‑level "light" fill for soft callouts.

The defining color move is the **lavender app background** (`#F6F2F7`) behind white paper cards. It's so close to white that screenshots read as monochrome, but it visually separates ZNO from the bone‑white of the EHRs it aggregates. Always use `bg-default` behind cards, never pure white at the page level.

### Type

- **Display: Montserrat 600.** Headings only (h1 28 → h6 14).
- **Body: Open Sans 400.** Everything else — tables, buttons, body, labels.
- Type is dense (line‑heights 117–150%) and tracking is positive (`0.25–1px`). The result reads "data‑heavy clinical tool", not "marketing landing page".
- Buttons are Open Sans 500 14px with `text-transform: none` (overriding MUI's default uppercase).

### Backgrounds, imagery, illustration

- **No photographs.** None in the codebase, none in Figma.
- **No gradients** — anywhere. Surfaces are flat fills.
- **No textures, no grain, no patterns.**
- A handful of **flat line illustrations** in `assets/illustrations/` (e.g. `favorite_organizations_example.svg`) — single‑weight 1.5px strokes in primary blue, used for empty states and onboarding hints.
- The full‑bleed visual you'd expect on a marketing site does not exist here. The hero is always: app bar + nav + a `Container maxWidth="xl"` of cards.

### Animation

- **Drawer transitions** are MUI's default cubic‑bezier (`cubic-bezier(0.4, 0, 0.2, 1)`) at 225–195ms. Defined in `lib/constants/navigation.ts`.
- **Hover/press** use only background opacity changes — no shrink, no lift, no springs.
- **Loading**: `LinearProgress` at the top of the page, `Skeleton` for content. Never spinners on full pages (small `CircularProgress size={60}` shows up only in dialog forms while saving).
- **No bounce, no parallax, no scroll‑linked motion.**

### Hover, press, focus, disabled

- **Hover**: `bg = primary @ 4%` (the action.hover token). Text stays the same. List rows, icon buttons, list items, tabs — all share this rule.
- **Selected**: `bg = primary @ 8%` with the active item's text color shifting to `primary.main`.
- **Press**: just falls back to selected; no scale.
- **Focus ring**: 2px solid `primary.main` outline, **outside** the element. Default browser focus is replaced.
- **Disabled**: `opacity: 0.38` on the element + `disabled background = rgba(0,0,0,0.12)`.

### Borders

- `--border` is `rgba(0,0,0,0.14)` — softer than MUI's default 0.12; this is the divider color used for table rules, drawer seams, and outlined input idle state.
- Buttons / inputs / cards: 1px solid divider; on hover the input border becomes black.
- Cards: borderless — they sit on the lavender canvas; the card itself is white paper with elevation 0, sometimes elevation 1.

### Inner / outer shadows

- The interface stays **mostly flat**. Surfaces use `--elev-0` (none).
- Dialogs: `--elev-24`. Popovers / menus: `--elev-8`. The app bar: a 1px bottom border, no shadow.
- No inset shadows anywhere.

### Protection gradients vs capsules

- Status pills are **capsules** (chips), not protection gradients. Filled chips use `bg = palette[status].main` with white text; outlined chips use `border = palette[status].main` with the matching text.
- There is **no** gradient‑over‑image scrim pattern, because there are no images.

### Layout rules

- Page chrome is fixed: a 64px top bar + a 240px left drawer (collapsing to 64px). The drawer is `variant="persistent"` — it pushes content, not overlays.
- Page body sits inside MUI's `Container maxWidth="xl"` (1536px) with `pt: 3` and `gap: 3` between major rows. **24px is the dominant rhythm.**
- Tabbed dashboards (Personal, Medical history, Maternity) all share the same skeleton: dashboard title row → `Tabs + Divider` → content stack.
- A 100px `Stack` is appended to the bottom of every dashboard so the floating help button doesn't sit on top of content.

### Transparency & blur

- **No backdrop blur**, anywhere.
- Hover/selected/focus states use rgba primary at 4/8/12% — the only place transparency appears in the system.
- Modals use a black backdrop at MUI's default 50% — no blur.

### Imagery vibe

- N/A — there is no imagery. If a future surface needs photography, follow this rule: cool, neutral, plenty of negative space, no people unless functionally required (e.g. patient avatar — and even those are initials‑on‑color in the codebase).

### Corner radii

- **4px is the default.** Buttons, inputs, cards, alerts.
- Chips are pills (radius 16px / `--radius-pill`).
- Avatars are circles.
- Dialogs are 4px. Drawers are 0px (sharp edge against the viewport).

### Cards

A "card" in ZNO is a `<Paper>` with:
- `background: --bg-paper` (white)
- `border-radius: 4px`
- `border: 0`
- `box-shadow: none` by default; `elevation 1` only when overlapping content
- Padding: `16–24px` depending on density

Cards never carry a colored left border accent, never have a rounded gradient corner, and never have a hover lift.

---

## 6 · Iconography

### What's used

- **Material Icons** (`@mui/icons-material`) — the dominant icon system. Imported per‑icon (`Help`, `FilterList`, `KeyboardArrowDown`, `EmojiObjectsOutlined`, `Info`, `Star`, `OpenInNew`, `EditOutlined`, `ArrowForward`, `WindowSharp`, `TableRows`, etc). All in MUI's filled or outlined Material 3 style at 24px (sometimes `fontSize="small"` = 20px or `large` = 35px).
- **Custom HINQ SVGs** for the navigation and module headers — flat, single‑color, currentColor‑aware. Examples in `assets/icons/nav/`: `client_info.svg`, `medication_history.svg`, `maternity.svg`, `chronic_care.svg`, `lab_results.svg`, `tasks.svg`. Each is roughly 24×24, simple line/fill style, designed to sit next to the MUI icons without clashing.
- **Custom common SVGs** in `assets/icons/common/` for inline content callouts: `allergies`, `drugs`, `vaccine`, `consent`, `nutrition`, etc.
- **Logo SVG**: `assets/hinq_logo.svg` — the wordmark + coral mark.

### What's NOT used

- ❌ No emoji — never in UI copy, never as bullets/icons.
- ❌ No Unicode glyphs as icons (no ✓, no ★, no ▶︎). Material Icons supply these.
- ❌ No Lucide / Heroicons / Phosphor / Tabler. The system is committed to Material Icons + bespoke nav SVGs. **Do not introduce a third icon library.**
- ❌ No PNG icons (the codebase is SVG‑only for icons).

### Rules

1. Module headers and the left nav use the **bespoke HINQ SVGs**.
2. Inline UI affordances (sort arrows, close buttons, expand chevrons, info bubbles, action buttons in tables) use **Material Icons**.
3. Color: always `currentColor` for icon strokes/fills. Set color via `color: 'primary'`, `color: 'text.secondary'`, or `color: 'inherit'`.
4. Stroke weight is implied (Material 3) — never override.
5. Sizes: 16, 20 (`small`), 24 (default), 35 (`large`), 60 (empty‑state hero). Stay on this scale.

If a needed icon isn't in Material Icons or in `assets/icons/`, **substitute the closest Material Icons match** rather than inventing a new style. Flag the substitution in code comments.

### Substitutions made in this design system

When recreating screens for the UI kit, where the production code references icons we don't have (e.g. `MedicationIcon`, `ReportsIcon` are imported from internal asset modules), this design system substitutes the closest **Material Icons** equivalent, namespaced from CDN where needed. Production code should keep using the original imports.

---

## 7 · Accessibility & touch targets

- Minimum interactive height is **40px** (MUI button medium); table row buttons are 32px. List items are 48px.
- Focus is always visible (2px primary outline). Don't disable it.
- Color contrast: `palette.contrastThreshold: 3.5` is set on the theme — the app aims at WCAG AA, but be aware error/warning red on white is on the edge; for chips with white text on `error.main`, this passes.

---

## 8 · UI Kits

| Kit | Path | Surface |
| --- | --- | --- |
| `zno-app` | `ui_kits/zno-app/` | The clinician‑facing patient record (single product) |

See each kit's README for the components and screens it ships.

---

## 9 · Caveats & known substitutions

- **Fonts**: Montserrat and Open Sans are loaded from **Google Fonts**. The MUI theme references these names directly without a self‑hosted file. No font files were shipped in the codebase — the Google Fonts versions match the production app.
- **Error vs Warning**: share a color in the source palette (`#FF6464`). Document this as a known weak spot; do not "fix" it without product approval.
- **Date/time pickers**: tied to `@mui/x-date-pickers` in production. The kit shows visual recreations only.
- **Charts**: Highcharts in production. The kit shows static placeholders.
- **No imagery / photography exists** in the brand. If a future surface needs hero imagery, request art direction.
