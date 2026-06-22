# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A multi-page, dependency-free visualization of instrument learning curricula:
a landing page of instrument cards plus one interactive D3 collapsible-tree
page per instrument (electric guitar, drums). Content is in Traditional
Chinese (`zh-TW`). There is **no build system, no package manager, no tests,
and no linter** — the entire app is a handful of hand-written HTML/CSS/JS
files plus a CDN D3 script tag on the tree pages.

## Running / previewing

Open `index.html` directly in a browser, or serve the folder statically:

```powershell
python -m http.server 8000   # then visit http://localhost:8000
```

A static server is only needed because the tree pages (`guitar.html`,
`drum.html`) load D3 from a CDN (`https://d3js.org/d3.v7.min.js`); the landing
`index.html` loads no D3. Opening files on `file://` mostly works, but a
server avoids browser file-access quirks. Deployment is **GitHub Pages**,
which is why the entry point is named `index.html`.

## File roles

- `index.html` — landing page. Loads `instruments.js` + `landing.js` to render
  one card per instrument. GitHub Pages entry point. No D3, no tree here.
- `instruments.js` — `const INSTRUMENTS` registry (`{id,label,emoji,page}`).
  Single source of truth for both the landing cards and each tree page's nav
  bar. Add an instrument here + a `data-<id>.js` + an `<id>.html` to extend.
- `guitar.html` / `drum.html` / `bass.html` — per-instrument tree pages. Each
  sets `<body data-instrument="<id>">` and loads, in order, D3 (CDN) →
  `instruments.js` → `data-<id>.js` → `script.js`.
- `data-guitar.js` / `data-drum.js` / `data-bass.js` — curriculum data as one
  global `const data` (`{ name, children?, url? }`). Edit these to change
  curriculum content.
- `landing.js` — builds the landing cards from `INSTRUMENTS`.
- `script.js` — shared tree renderer + interaction (D3 v7). Reads the root
  title from `data.name` and renders the nav bar from `INSTRUMENTS` +
  `document.body.dataset.instrument`. Tree algorithm is instrument-agnostic.
- `style.css` — dark theme: tree nodes/links/tooltip, `.nav-bar`, landing
  `.card`s. Node appearance is class-driven (see node-type model below).

## Architecture you must understand before editing `script.js`

### Bottom-up layout
The tree grows **upward** from a root anchored near the bottom of the viewport.
D3's `tree()` computes normal top-down coordinates, then `diagonal()` and the
node transforms **negate `y`** (`translate(d.x, -d.y)`) to flip it. The SVG is
sized at least one viewport tall, and on every `update()` the page auto-scrolls
by the height delta so the root stays visually pinned while branches expand or
collapse above it (`prevSvgH` / `delta` logic, plus the `isInit` first-render
scroll-to-bottom). `html { overflow-anchor: none }` is required for this to work.

### Three-state collapse model
Every hierarchy node tracks children across **three** properties — do not
collapse these into one:
- `children` — currently visible/expanded children.
- `_children` — collapsed children (hidden, restorable on expand).
- `_initHidden` — siblings hidden specifically by the initial "leftmost path"
  single-layer expansion, kept separate so they can be re-merged correctly.

`uid` (assigned once via `root.each`) is the D3 data-join key for object
constancy — it must stay stable across updates; never rebuild the hierarchy.

### Interaction semantics
- **Single-layer expand**: clicking a collapsed node reveals only its immediate
  children (`expandLeftmostPathOnly` enforces this at startup).
- **Recursive collapse**: clicking an expanded node calls `collapseSubtree`,
  which resets the *entire* subtree below it, so re-expanding starts fresh.
- **Leaf links**: a leaf with `data.url` opens it in a new tab on click instead
  of toggling.
- **Expand/collapse all** button toggles `expandAll` / `collapseAll` over the
  whole tree (these must also reconcile `_initHidden`).

### Node typing (drives all styling)
`nodeClass(d)` returns one of `n-root` / `n-collapsed` / `n-expanded` /
`n-leaf` / `n-leaf-link`. Appearance, cursor, and hover effects live in
`style.css` keyed on these classes — change visuals there, not in JS. Link and
leaf-text colors cycle by depth / sibling index (`LINK_COLORS`, `LEAF_COLORS`,
`leafTextColor`).

### Text wrapping
`wrapText` breaks labels by character count: **pure-CJK names wrap at 5 chars,
names containing any Latin letter or digit wrap at 10** (mixed Chinese/English
labels are common in the data and rely on this rule).

## Conventions specific to this repo

- Design specs and step-by-step plans live in `docs/plans/` and
  `docs/superpowers/`; web-research notes backing content/URL choices live in
  `docs/references/external_sites/` (one file per source). When adding leaf
  `url`s sourced from research, follow the existing note-per-source pattern.
- UI copy and commit-relevant content is Traditional Chinese; keep new
  user-facing strings consistent with that.
