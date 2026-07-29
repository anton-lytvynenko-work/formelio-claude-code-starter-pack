## Design System — HINQ ZNO

**Rule:** Every UI change in this project follows the HINQ ZNO design system. The system lives at `hinq-zno-design-system/` at the repo root. Read `hinq-zno-design-system/CLAUDE.md` end-to-end before designing or modifying any UI; it is the binding source of truth.

### Where the source of truth lives

| Need | File |
|---|---|
| Hard rules (full long form) | `hinq-zno-design-system/CLAUDE.md` |
| Brand voice, color usage, copy rules | `hinq-zno-design-system/README.md` |
| Component recipes & layout patterns | `hinq-zno-design-system/SKILL.md` |
| Design tokens (CSS custom properties) | `hinq-zno-design-system/colors_and_type.css` |
| Reference primitives (working React) | `hinq-zno-design-system/ui_kits/zno-app/components/` |
| Tabs preview | `hinq-zno-design-system/preview/components-tabs-nav.html` |
| Chips preview | `hinq-zno-design-system/preview/components-chips.html` |
| Buttons preview | `hinq-zno-design-system/preview/components-buttons.html` |
| Inputs preview | `hinq-zno-design-system/preview/components-inputs.html` |
| Alerts preview | `hinq-zno-design-system/preview/components-alerts.html` |
| Empty states recipe | `hinq-zno-design-system/README.md` § 5 + `hinq-zno-design-system/SKILL.md` |

The MUI theme at `src/lib/theme/theme.ts` consumes the CSS variables from `colors_and_type.css`, which is imported globally in `src/app/layout.tsx`.

### The 5 binding rules

1. **Tokens, not literals.** Every color, radius, shadow, font and spacing comes from a token: MUI `theme.palette.*` / `theme.typography.*`, or `var(--hinq-*)` / `var(--fg-*)` / `var(--bg-*)` / `var(--radius-*)` / `var(--elev-*)`. **No inline hex in component or page code.** Two files (and only two) are allowed to contain raw color values: `hinq-zno-design-system/colors_and_type.css` (the source of truth) and `src/lib/theme/theme.ts` (the bridge that maps tokens to MUI's runtime palette — MUI's `alpha()` / `darken()` utilities can't parse `var()` strings, so this file mirrors token values as hex and documents the source token alongside each one). If a token is missing, add it to `colors_and_type.css` first, then mirror it into `theme.ts` — never invent ad-hoc values in consumer code.

2. **Sentence case for all user-facing text.** `Request permission`, `Medical history`, `Awaiting consent` — never `Request Permission`. Acronyms stay capitalized: `BSN`, `ZNO`, `ACP`, `JGZ`, `COPD`. Page titles are nouns; tab labels are short. Periods on full sentences, none on labels.

3. **Use the existing components, don't reimplement.** Reach for MUI primitives + the kit components in `hinq-zno-design-system/ui_kits/zno-app/components/` (`Button`, `Chip`, `Drawer`, `AppBar`, `Sidebar`, `SourceStatus`, etc.) and match their API exactly. Status chips are one or two words; date/detail goes adjacent (muted, smaller), never inside the chip.

4. **The visual prohibitions.** No emoji anywhere. No gradients. No drop shadows beyond the `--elev-*` tokens. No pure-white page background — use `--bg-default` lavender; pure white is for cards. No third icon library — Material Icons Outlined + HINQ glyphs only. No backdrop blur. No coral CTAs (coral is logo accent + error/warning only). No ALL-CAPS for emphasis — use `subtitle1` weight (600).

5. **Empty states are a system, not ad-hoc.** Use the `.empty` recipe — `.empty` container · 96px lavender `.icon-bg` · 36px outlined Material icon · h5 line · b1 muted explainer · outlined CTA — and explain WHY + HOW. Never use a vague "No data" placeholder.

### Composition rules (when creating UI components)

These extend the 5 binding rules with concrete patterns. They live in this project's rule layer because the kit doesn't yet ship React components for them — see `docs/design-system-gaps.md` for items to upstream to `hinq-zno-design-system/` later.

- **Theme overrides over per-call-site `sx` when the override applies globally.** MUI defaults (notched-floating-label inputs, plain Alerts, default Card elevation) survive a hex-clean migration as visibly generic-MUI. `MuiOutlinedInput` / `MuiButton` / `MuiCard` / `MuiAlert` / `MuiDialog` / `MuiTabs` / `MuiTab` / `MuiChip` / `MuiTableHead/Row/Cell` styleOverrides in `src/lib/theme/theme.ts` are mandatory in any design-system migration.
- **Label-above input pattern** (per `hinq-zno-design-system/preview/components-inputs.html`): label rendered ABOVE the input as 12px gray text — NOT MUI's floating-notched label. Use the shared `<TextField>` / `<SelectField>` wrappers in `src/components/ui/`; bypass MUI's `<TextField>` directly because its floating-label is structural.
- **`<FormPage maxWidth=...>` for forms.** Page-width is bounded by `<Container maxWidth="xl">` in `src/app/layout.tsx`; form content-width is a separate concern (640px single-column, 900px form-with-table). Don't reintroduce ad-hoc `<Box sx={{ maxWidth }}>`.
- **Status chips → `<StatusChip domain="..." />` + `src/lib/ui/status-labels.ts`** when 2+ surfaces render the same status pattern. Inline `<Chip color={x === 'A' ? 'success' : 'error'} label={raw} />` ternaries drift between surfaces.
- **`react-hook-form` Controller for every form input.** Validation errors via the wrapper's `error` prop. No uncontrolled inputs.
- **Form UX copy mandatory:** every `TextField` has helperText explaining what's expected (not just the error message), placeholder with concrete example, password-in-edit-mode helperText = `Leave blank to keep existing X`.

### Project framework (Next.js App Router)

- **`ThemeProvider` must be `'use client'`.** MUI themes contain breakpoint functions that don't serialize Server → Client. Wrapper lives at `src/components/ui/theme-provider.tsx`; never use MUI's `ThemeProvider` directly from `src/app/layout.tsx`.
- **File path imports use `@/components/{display,layout,ui,connections,explorer,qualification}/`.** See `docs/architecture.md` Directory Map.

### Verification before completion

Before marking any UI task done:

- `rg "#[0-9a-fA-F]{3,8}" src/ -t ts -t tsx -t css` → hits only inside `src/lib/theme/theme.ts` (the allowed bridge file). Zero hits anywhere else.
- Open the matching `hinq-zno-design-system/preview/*.html` page and visually diff against the rendered result — spacing, typography weight, chip casing, hover states all must match.
- Confirm sentence case on every user-facing string introduced or edited.
- Confirm no emoji, no gradients, no inline hex, no third icon library.

### When user feedback says "this looks off"

Don't guess colors or padding. Open the matching preview, identify which token / component is being violated, and fix the underlying violation — don't tweak values to "look right". If a real gap exists in the design system (missing token or variant), surface it rather than papering over it.
