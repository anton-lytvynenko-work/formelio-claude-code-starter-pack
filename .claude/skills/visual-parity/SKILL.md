---
name: visual-parity
description: Compare a rebuilt UI to its source (live site, Figma, or screenshot reference) section-by-section using Playwright MCP, classify each section as match/divergent/cannot-replicate, and produce a written parity report with reasons for any divergences.
allowed-tools: Read,Write,Edit,Bash,Glob,Grep
version: 1.0.0
---

# Visual Parity

Section-by-section visual comparison between a rebuild and its reference, with **a written reason for every section that doesn't match**. Produces a durable artifact at `docs/parity-report.md`.

## When to Use

Invoke this skill when:

- A `/implement` task touches `.astro`, `.tsx`, `.jsx`, `.vue`, `.html`, or CSS files **and** the task has a visual reference (a live site URL, a Figma file, or a screenshot)
- The user says "compare to live", "match the design", "verify it looks right", or "check parity"
- Any plan task has a DoD that mentions "visual match", "side-by-side comparison", or "screenshot diff"
- A page is being rebuilt from an existing system (CMS→static, one framework→another, etc.)
- **The user gives a new round of visual feedback after a prior parity claim.** Each feedback round = re-invoke. Don't treat the first verification as sufficient — UI feedback typically arrives in 2–3 rounds.

**Do NOT invoke** for:
- Pure-logic / data-layer changes
- Backend-only work
- Initial scaffolding before any UI exists
- One-off tweaks where the user has already eyeballed the result

## Why This Skill Exists

`/implement` will mark a UI task "complete" when the build is green and the DoD checklist is ticked, even if the page looks nothing like the reference. Pixel-diff tools (`pixelmatch`, etc.) catch *that* something differs but not *why* or *whether the divergence is acceptable*. This skill is the human-in-the-loop gate that produces written reasoning.

The output — `docs/parity-report.md` — is intended to outlive the implementation: future maintainers can see exactly which sections diverge from source and why, without spelunking through chat history or PR descriptions.

## Required Tools

- **Playwright MCP** (`mcp__playwright__browser_navigate`, `browser_take_screenshot`, `browser_evaluate`, `browser_resize`). If MCP is not configured, the skill cannot run — instruct the user to set it up first via `claude mcp add`.
- Local preview server running at a known URL (e.g. `http://localhost:5173/`, `http://localhost:3000/`, `http://localhost:4321/` — whatever the project's dev server uses).

## Workflow

### Step 0 — Confirm preconditions

1. Confirm Playwright MCP tools are available (loaded in the session).
2. Confirm the local preview is reachable: `curl -s -o /dev/null -w "%{http_code}" <local-url>` returns 200.
3. Confirm a reference URL/file is provided. If unclear, ask once: *"What's the source of truth I'm comparing against?"*

### Step 0.5 — Pre-flight project-specific constraints (BEFORE first live request)

Before the very first `browser_navigate` to the reference URL, check the project's rules for known constraints on the reference site:

```bash
ls .claude/rules/custom/ 2>/dev/null
grep -lE 'WAF|CDN|bot.?protection|Cloudflare|rate.?limit|playwright' .claude/rules/custom/*.md 2>/dev/null
```

If any rule documents a block-list, fingerprinting, or rate-limit on the reference site, **default to cached captures** (screenshots saved from a prior audit) instead of attempting a fresh live request. Note the constraint in the parity-report entry as the reason for using cached captures.

Why this matters: some WAFs / bot-protection layers fingerprint Playwright's user-agent on the first request and then 403 the originating IP for a cooldown window. One unguarded `browser_navigate` can burn that window for any subsequent attempt — including curl-based recapture flows in the same session. When a project rule documents such a constraint, respect it: recapturing live is often unrecoverable without IP rotation, and reference content rarely drifts enough over a short window to justify the risk.

If a project rule indicates the reference is JS-rendered and a cached static HTML snapshot exists, use that for DOM-level inspection (`grep`, regex on the HTML) and a cached image for visual reference.

### Step 1 — Read prior parity history

Read `docs/parity-report.md` if it exists. It is the running log; new entries append to it. **Do not overwrite earlier entries.**

If the file doesn't exist, create it with the schema header:

```markdown
# Parity Report

Section-by-section comparison between the rebuild and source.

**Status legend:**
- ✅ Match — structurally and visually equivalent within tolerance
- ⚠️ Minor divergence — recognizable but differs in a polish detail; captured in an ADR or accepted-divergences list
- ❌ Cannot replicate — structural divergence that cannot be matched given current constraints; reason MUST be written

---
```

### Step 2 — Capture both sides

For each viewport (default: 1440×900 desktop and 375×812 mobile):

```
mcp__playwright__browser_resize(width: <W>, height: <H>)
mcp__playwright__browser_navigate(url: <reference-url>)
# Wait for animations / lazy-load — see Step 2.3
mcp__playwright__browser_take_screenshot(filename: ".playwright-mcp/source-<page>-<W>.jpeg", fullPage: true)

mcp__playwright__browser_navigate(url: <local-url>)
mcp__playwright__browser_take_screenshot(filename: ".playwright-mcp/local-<page>-<W>.jpeg", fullPage: true)
```

For ambiguous structural questions (font weight, exact spacing, color values), use `browser_evaluate` to read DOM/CSS directly rather than guessing from the screenshot.

### Step 2.1 — Pre-diff text grep (catch content bugs before visual diff)

Some bugs are textual, not visual. Run these checks on the local rendered DOM **before** comparing screenshots:

```js
mcp__playwright__browser_evaluate(() => {
  const t = document.body.innerText;
  return {
    truncatedEllipsis: t.includes('[…]') || /\[\.\.\.\]/.test(t),   // CMS meta-truncation
    looseEllipsis: / \.\.\. /.test(t) || t.endsWith('...'),
    loremIpsum: /lorem ipsum/i.test(t),
    placeholderText: /\bTODO\b|\bTBD\b|\bplaceholder\b/i.test(t),
    brokenZero: Array.from(document.querySelectorAll('[data-target], .stat-value, .counter')).filter(el => el.textContent.trim() === '0').length,
    brokenImgs: Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
  };
});
```

Any non-empty result is a content bug. Fix at the source (frontmatter, content collection, or data file) before continuing — these never resolve by visual fiddling.

**Common origins of these bugs:**
- Truncated `[…]` in hero/intro → the page fell back to an auto-generated meta description instead of the real intro copy. Fix: populate the intro field properly.
- Lorem ipsum → placeholder copy that never got replaced before claiming done.
- Broken `0` counters → data binding broken on source; rebuild needs an explicit data file.
- Broken images → missing local asset or a stale remote URL not rewritten.

### Step 2.2 — Source content validation (re-fetch if CMS-driven)

If the reference is a CMS-driven page (WordPress, Webflow, Contentful, etc.), **do not trust cached content from a prior scrape**. Content drift is invisible in screenshots until users notice it.

If the project has a content-sync/scrape step, re-run it for the target page and review the diff before comparison. If the freshly fetched content differs materially from the cached copy, the local page may be rendering stale content — fix the source content before screenshot comparison.

### Step 2.3 — Lazy-load primer

Live sites with marquees, sliders, intersection-observed counters, or `loading="lazy"` images won't expose all elements on initial paint.

**Mutating `img.loading = 'eager'` after first paint is not enough** — browsers cache the "skipped" decision for a lazy image. Scrolling it into view later may still not force a fetch. The reliable approach is to **remove the `loading` attribute *and* reset `src`**, which re-enters the network-fetch path unconditionally:

```js
mcp__playwright__browser_evaluate(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const imgs = Array.from(document.querySelectorAll('main img'));
  await Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    img.removeAttribute('loading');
    return new Promise((res) => {
      img.addEventListener('load', () => res(), { once: true });
      img.addEventListener('error', () => res(), { once: true });
      // Reset src to re-trigger fetch — mutating `loading` alone is insufficient
      const s = img.src; img.src = ''; img.src = s;
      setTimeout(res, 3000); // hard timeout per image
    });
  }));
  await sleep(300);
  const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0);
  return { total: imgs.length, broken: broken.length, brokenSrcs: broken.map(i => i.src) };
});
```

**Assert before screenshotting:** if `broken > 0`, the screenshot will show empty slots. Investigate `brokenSrcs` — if the URLs return 404, the asset isn't available. If they return 200 but didn't load in time, increase the per-image timeout or re-run.

For marquee/slider content that *animates* (e.g. a partner-logo carousel), the eager primer above won't help if frames rotate out of view between paint and screenshot. Use `browser_evaluate` to pause the animation (`document.querySelectorAll('.marquee').forEach(el => el.style.animationPlayState = 'paused')`) before capturing.

### Step 2.4 — Asset recovery

When the screenshot reference has illustration tiles, icon grids, or composite widget images that aren't present locally, **do not handcraft replacements first**. The asset is usually downloadable; the label/alt may just be missing from the cached HTML.

**Recovery procedure:**

1. Enumerate every referenced asset URL in the reference page's HTML:
   ```bash
   grep -oE '(https?:)?//[^"'"'"']+\.(png|jpg|jpeg|svg|webp)' <cached-reference-html> | sort -u
   ```
2. Cross-reference against the project's local assets directory to find which are not yet mirrored.
3. For each unmirrored or unfamiliar asset, fetch + Read it:
   ```bash
   curl -fsSL "<asset-url>" -o "/tmp/probe.<ext>"
   # then Read(/tmp/probe.<ext>) — multimodal Read renders the image inline so you can match it visually to the screenshot reference
   ```
4. When the visual match is found, copy it into the project's assets directory so the rebuild's `<img src>` paths resolve.

**Failure mode this guards against:** spending a turn handcrafting SVG icon paths from a reference screenshot when the reference's exact asset was already downloadable, just label-less and overlooked.

### Step 3 — Section-by-section walkthrough

Identify the sections of the page (hero, grid, list, footer, etc.) and compare each pair across both viewports. For each section, classify:

- **✅ Match** — structurally and visually equivalent within reasonable tolerance. Anti-aliasing differences and sub-pixel font rendering are not divergences.
- **⚠️ Minor divergence** — recognizable but differs in a polish detail. Examples: slightly different shade, different font weight, different spacing. Acceptable if captured in an ADR or "accepted divergences" section of the implementation plan.
- **❌ Cannot replicate** — structural difference that cannot be matched. Examples: missing asset, source has broken behavior, source uses a feature the rebuild deliberately doesn't have.

**Every `❌` requires a written reason.** Categories of acceptable reasons:

| Reason | Example |
|---|---|
| Source is broken | Live shows literal `0` for animated counters; rebuild renders user-supplied values |
| Asset unavailable | Source's brand asset isn't on disk and isn't downloadable; user must provide |
| Deliberate scope cut | Plan explicitly excludes feature (e.g. "no JS slider in v1") |
| Source uses runtime/CMS we replaced | Dynamic archive on live; static collection on rebuild |
| Different platform constraint | Mobile-only feature that doesn't apply on web |

**Unacceptable** reasons (these are bugs, not divergences):
- "I didn't get to it"
- "It looks close enough" (without specifying what differs)
- "Not sure why it differs"

### Step 3.5 — Layout invariants (numeric checks, not eyeballs)

Pixel diff misses small alignment slips. Some pairs *must* line up; verify with `getBoundingClientRect()` rather than eyeballing the screenshot.

```js
mcp__playwright__browser_evaluate(() => {
  const heroImg = document.querySelector('section.hero img:not([aria-hidden])');
  const heroTitle = document.querySelector('section.hero h1');
  return {
    heroAlignDeltaY: heroImg && heroTitle ? heroImg.getBoundingClientRect().top - heroTitle.getBoundingClientRect().top : null,
    marqueeUniqueCount: new Set(Array.from(document.querySelectorAll('.marquee li img')).map(i => i.src)).size,
    marqueeTotalCount: document.querySelectorAll('.marquee li img').length,
  };
});
```

Expectations for typical marketing-style layouts:
- Image-title alignment delta ≈ 0 (or a small fixed offset). Anything >50px usually indicates a centering rule collapsing one column.
- A duplicated marquee has total = 2 × unique (the track is duplicated for the loop animation).

Encode the expected pair list in the parity-report entry so future verifications can check against it.

### Step 4 — Write/append the report entry

Append to `docs/parity-report.md`:

```markdown
## /<page-path>/

Verified: YYYY-MM-DD
Reference: <reference-url>
Local: <local-url>
Implementer: Claude Code

### Sections

| Section | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Hero | ✅ | ✅ | |
| Featured cases | ✅ | ⚠️ | Mobile font weight differs (live=600, rebuild=700) |
| Stats | ❌ | ❌ | See "Cannot replicate" below |
| Footer | ✅ | ✅ | |

### Cannot replicate

#### Stats — values differ from source

- **What source does:** renders `0` for all four counters (broken data binding)
- **What rebuild does:** renders values supplied via `data/stats.json`
- **Why we can't match exactly:** source is broken; faithful match would mean rendering literal zeros
- **Decision:** accepted divergence (improvement on broken source). Captured in ADR-0002.
- **Screenshots:** [source-1440](.playwright-mcp/source-home-1440.jpeg) ↔ [local-1440](.playwright-mcp/local-home-1440.jpeg)

### Minor divergences

#### Featured cases — mobile font weight

- Source uses 600; rebuild uses 700
- Below threshold for fix; tracked for future polish pass
```

### Step 5 — Status escalation

| Outcome | Action |
|---------|--------|
| All sections `✅` | Task is done. Commit the parity-report entry alongside the implementation. |
| Any `⚠️` | Task is done **only if the divergence is captured in an ADR or accepted-divergences section of the plan**. If new, surface to user before closing. |
| Any `❌` | Task is **NOT done** until the user has been informed and made a decision. Possible decisions: (a) accept and add to ADR, (b) provide missing input (asset/data), (c) require a fix as a follow-up task. The parity-report entry remains as documentation regardless. |

### Step 6 — Suggest next step

After writing the entry, output a one-line summary to the user:

```
Parity report updated for /<page>/: ✅ X sections match, ⚠️ Y minor, ❌ Z unmatched.
[If ❌: list each unmatched section with one-line reason and ask for a decision.]
```

## Motif consistency (when adding new visual elements)

If a user feedback round asks for new visual elements ("add icons", "add a callout", "add a card"), do not invent the visual treatment. **Grep the codebase for established motifs first** so the new element reuses an existing pattern rather than introducing a one-off:

```bash
grep -rn "clip-path\|accent\|badge\|pill\|callout" src/ --include="*.css" --include="*.tsx" --include="*.astro"
```

Re-using an established motif keeps the page coherent and avoids a follow-up feedback round. When the user says "in the style of the current site/app", they mean *one of the existing motifs* — find it before building.

## Pitfalls

- **Don't compare full-page screenshots with `pixelmatch`.** Different total heights → tool errors out. Capture per-section clipped screenshots (`browser_take_screenshot` with element refs from `browser_snapshot`) when numeric diffs are needed.
- **Don't trust screenshots alone for structural questions.** Use `browser_evaluate` to read computed styles, DOM tree, or counts (`document.querySelectorAll('.cards li').length`).
- **Don't classify a section as ✅ when you only checked desktop.** Mobile parity is a separate column for a reason.
- **Don't skip the report when nothing diverges.** A `## /<page>/` entry with all ✅ is still useful — it's evidence the page was checked.
- **Don't overwrite earlier entries.** Append. The report accumulates.
- **Don't propose a fix for a `❌` section yourself.** Surface it to the user. They decide accept-vs-fix.

## Relationship to other skills

- **`code-review`** runs *before* this skill (catches anti-patterns in the diff). This skill runs *after* (catches outcome divergence).
- **`debug-fresh`** runs *instead of* this skill when a page is broken (e.g. errors, blank renders). Visual parity assumes the page renders.
- **Automated pixel-diff harnesses** (e.g. a `scripts/verify-visual.ts` if the project has one) are complementary: they gate regressions on previously-blessed pages; this skill blesses pages in the first place with written reasoning.

## Output

- `docs/parity-report.md` — appended with one entry per page verified
- `.playwright-mcp/source-*.jpeg` and `.playwright-mcp/local-*.jpeg` — screenshot pairs referenced from the report
- One-line summary in chat for the user
