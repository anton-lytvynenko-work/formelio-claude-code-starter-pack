# How to use this design system with Claude Code

## 1. Drop the folder into your repo

Place this entire `hinq-zno-design-system/` folder in your project root, ideally renamed to `hinq-zno-design-system/`:

```
your-app/
├── hinq-zno-design-system/         ← this folder, renamed
│   ├── CLAUDE.md          ← (see step 2)
│   ├── README.md
│   ├── SKILL.md
│   ├── colors_and_type.css
│   ├── assets/
│   ├── fonts/
│   ├── preview/
│   └── ui_kits/
├── src/
└── ...
```

## 2. Wire `CLAUDE.md` into Claude Code

Claude Code automatically reads a `CLAUDE.md` at the repo root on every session. Two options:

**Option A — single root `CLAUDE.md`** (simplest)
Move `hinq-zno-design-system/CLAUDE.md` to your repo root. Edit the first line if you already have a `CLAUDE.md` — append the design-system section to it instead of replacing yours.

**Option B — keep it nested**
Leave `CLAUDE.md` inside `hinq-zno-design-system/` and add this line to your repo-root `CLAUDE.md`:

```md
For all UI work, follow the rules in `hinq-zno-design-system/CLAUDE.md`. Read it before designing or modifying any interface.
```

## 3. Wire the tokens into your app

```html
<!-- in your app's root HTML / layout -->
<link rel="stylesheet" href="/hinq-zno-design-system/colors_and_type.css" />
```

Or if you bundle CSS:

```css
@import "../hinq-zno-design-system/colors_and_type.css";
```

Fonts live in `hinq-zno-design-system/fonts/` — self-host them, don't pull from a CDN. The `@font-face` rules are already in `colors_and_type.css`; just make sure the relative paths to the `.ttf` files resolve from where you import the CSS.

## 4. Verify it's working

Ask Claude Code: *"Show me the design tokens you'll use for primary, neutrals, and body type."*

It should answer with token names from `colors_and_type.css` (`--hinq-primary-main`, `--fg-1`, `--font-body`), not raw hex codes. If it gives you raw values, the file isn't being read — check that `CLAUDE.md` resolves from the repo root.

## 5. Updating the design system

When the design system changes (new component, new token, copy revision), replace the `hinq-zno-design-system/` folder wholesale. `CLAUDE.md` is intentionally short and stable; the long-form rules live in `README.md` and `SKILL.md`, which Claude Code will open on demand.
