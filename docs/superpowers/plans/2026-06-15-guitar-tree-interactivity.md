# Guitar Tree Interactivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 `guitar-learning-tree.html` 新增 4 項互動功能：leaf URL 連結、全展開/收合按鈕、單層展開、預設最左路徑展開。

**Architecture:** 所有變更集中在單一 HTML 檔案，分為 Data 層（加 url 欄位）、Helper 函式層（collapseSubtree / expandAll 等）、CSS 層（cursor / button 樣式）、DOM 層（按鈕元素）。各 task 相互獨立，順序執行即可。

**Tech Stack:** D3.js v7（已引入），Vanilla JS，無 build toolchain，Browser 手動驗證。

---

## File Structure

- Modify: `guitar-learning-tree.html`
  - `<style>` 區塊：新增 `.n-leaf`, `.n-leaf-link`, `#expand-toggle` CSS
  - `<body>`：新增 `<button id="expand-toggle">` DOM 元素
  - `const data`：部分 leaf node 加上 `url` 欄位
  - Script 函式區：新增 `collapseSubtree`, `expandAll`, `collapseAll`, `expandLeftmostPath`
  - `nodeClass()`：加入 `n-leaf-link` class 判斷
  - `tooltipContent()`：leaf 有 url 時顯示連結提示
  - click handler：leaf with url → open URL；branch → collapseSubtree on collapse
  - Init block：呼叫 `expandLeftmostPath(root)`

---

### Task 1: 在 data 中為 leaf nodes 加上 url 欄位

**Files:**
- Modify: `guitar-learning-tree.html` — `const data` 區塊

- [ ] **Step 1: 找到並修改左手技巧區的 leaf nodes（技巧類 → Wikipedia Guitar Technique）**

在 `guitar-learning-tree.html` 的 `const data` 中，找到下列 leaf nodes 並加上 `url` 欄位（`https://en.wikipedia.org/wiki/Guitar_technique`）：

```js
// 左手技巧 — 以下 7 個 leaf node 各加上 url:
{ name: "推弦 Bending", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "滑弦 Slide / Glissando", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "捶弦 Hammer-on", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "勾弦 Pull-off", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "顫音 Vibrato", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "點弦 Tapping（進階）", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
```

- [ ] **Step 2: 修改右手技巧區的 leaf nodes**

```js
// 右手技巧 — 以下 4 個 leaf node 各加上 url:
{ name: "撥片握法與角度", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "交替撥弦 Alternate Picking", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "掌側悶音 Palm Mute", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "指彈 Fingerpicking", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
{ name: "掃弦技 Sweep Picking（進階）", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
```

- [ ] **Step 3: 修改音階區的藍調音階 leaf node**

```js
// 音階區 — Blues Scale
{ name: "藍調音階 Blues Scale", url: "https://en.wikipedia.org/wiki/Blues_scale" },
```

- [ ] **Step 4: 修改音箱區的 3 個 leaf nodes**

```js
// 音箱 Amplifier — 3 個 leaf node:
{ name: "真空管音箱 Tube Amp", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" },
{ name: "電晶體音箱 Solid State", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" },
{ name: "數位模擬 Kemper / HX Stomp", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" },
```

- [ ] **Step 5: 瀏覽器驗證 data 正確**

開啟 `guitar-learning-tree.html`，在 DevTools Console 執行：
```js
root.leaves().filter(d => d.data.url).map(d => d.data.name)
```
應回傳 15 個節點名稱陣列（如有遺漏可逐一核對）。

- [ ] **Step 6: Commit**

```bash
git add guitar-learning-tree.html
git commit -m "feat: add url field to leaf nodes (Guitar Technique/Amplifier/Blues Scale)"
```

---

### Task 2: 加入 collapseSubtree helper，更新 click handler（Feature 3）

**Files:**
- Modify: `guitar-learning-tree.html` — Script 區 helper 函式 + click handler

- [ ] **Step 1: 在 Script 區加入 `collapseSubtree` 函式**

在 `// ── Tooltip ──` 區塊上方加入：

```js
// ── Tree helpers ─────────────────────────────────────────────────
function collapseSubtree(node) {
  if (node.children) {
    node.children.forEach(collapseSubtree);
    node._children = node.children;
    node.children = null;
  }
}
```

- [ ] **Step 2: 更新 click handler，收合時使用 collapseSubtree**

找到 `nodeEnter` 的 click handler（約在 `.on("click", ...)` 區塊），替換為：

```js
.on("click", (event, d) => {
  if (d.children) {
    collapseSubtree(d);
  } else if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  hideTooltip();
  update(d);
})
```

（此時尚未加入 leaf URL 分支，下個 task 才加。）

- [ ] **Step 3: 瀏覽器驗證單層展開**

1. 展開 `技術入門` → `基本技巧` → `左手技巧`（展開三層）
2. 點擊 `基本技巧` 收合
3. 再展開 `基本技巧` → 應只看到 `左手技巧` 與 `右手技巧`，不應自動展開 `左手技巧` 的子節點

- [ ] **Step 4: Commit**

```bash
git add guitar-learning-tree.html
git commit -m "feat: collapse subtree on node collapse for one-layer-expand behavior"
```

---

### Task 3: 預設展開最左路徑（Feature 4）

**Files:**
- Modify: `guitar-learning-tree.html` — Script 區 helper 函式 + init block

- [ ] **Step 1: 加入 `expandLeftmostPath` 函式**

緊接在 `collapseSubtree` 函式之後加入：

```js
function expandLeftmostPath(node) {
  const pool = node._children || node.children;
  if (!pool || pool.length === 0) return;
  if (node._children) {
    node.children = node._children;
    node._children = null;
  }
  expandLeftmostPath(node.children[0]);
}
```

- [ ] **Step 2: 在 init 區塊呼叫 expandLeftmostPath**

找到 init block（`root.each(d => { if (d.depth > 1 ...)`），在它結束的 `});` 之後加入：

```js
// Expand leftmost path to leaf on initial load
expandLeftmostPath(root);
```

最終 init 區塊完整樣貌（供確認）：
```js
root.each(d => {
  if (d.depth > 1 && d.children) {
    d._children = d.children;
    d.children  = null;
  }
});

// Expand leftmost path to leaf on initial load
expandLeftmostPath(root);
```

- [ ] **Step 3: 瀏覽器驗證**

重新整理頁面，樹應預設展開：
`🎸 電吉他學習` → `技術入門` → `基礎入門` → `認識吉他結構` → `琴頭・琴頸・琴身`

其他節點應保持收合狀態。

- [ ] **Step 4: Commit**

```bash
git add guitar-learning-tree.html
git commit -m "feat: expand leftmost path to leaf on page load"
```

---

### Task 4: Leaf URL 點擊開啟、cursor CSS、tooltip 更新（Feature 1）

**Files:**
- Modify: `guitar-learning-tree.html` — CSS、`nodeClass()`、`tooltipContent()`、click handler

- [ ] **Step 1: 更新 CSS — `.n-leaf` 改為 default cursor，新增 `.n-leaf-link`**

找到現有 `/* leaf */` CSS 區塊，將 `.node.n-leaf` 的 cursor 設為 `default`，並新增 `n-leaf-link`：

```css
/* leaf */
.node.n-leaf circle { fill: #051005; stroke: #44BB44; }
.node.n-leaf text   { fill: #6DCF70; font-size: 14px; }
.node.n-leaf        { cursor: default; }

/* leaf with url */
.node.n-leaf-link circle { fill: #051005; stroke: #44BB44; }
.node.n-leaf-link text   { fill: #6DCF70; font-size: 14px; }
.node.n-leaf-link        { cursor: pointer; }
.node.n-leaf-link:hover circle { filter: brightness(1.9) drop-shadow(0 0 6px #44BB44); }
```

- [ ] **Step 2: 更新 `nodeClass()` — 有 url 的 leaf 回傳 `n-leaf-link`**

找到 `function nodeClass(d)` 函式，替換為：

```js
function nodeClass(d) {
  if (d.depth === 0) return "node n-root";
  if (d._children)   return "node n-collapsed";
  if (d.children)    return "node n-expanded";
  return d.data.url ? "node n-leaf-link" : "node n-leaf";
}
```

- [ ] **Step 3: 更新 `tooltipContent()` — leaf 有 url 時顯示連結提示**

找到 `function tooltipContent(d)` 中處理 leaf 的最後一段（`const safe = ...`），替換為：

```js
// leaf node
if (d.data.url) {
  const hostname = new URL(d.data.url).hostname;
  const safe = d.data.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<div class="tip-action" style="color:#6DCF70">🔗 點擊前往</div><div class="tip-leaf">${safe}</div><div class="tip-items" style="margin-top:4px;color:#667">${hostname}</div>`;
}
const safe = d.data.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
return `<div class="tip-leaf">${safe}</div>`;
```

- [ ] **Step 4: 更新 click handler — leaf with url → window.open**

找到 Task 2 修改過的 click handler，在最前面加入 leaf url 分支：

```js
.on("click", (event, d) => {
  // Leaf with URL: open link
  if (!d.children && !d._children && d.data.url) {
    window.open(d.data.url, '_blank');
    return;
  }
  if (d.children) {
    collapseSubtree(d);
  } else if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  hideTooltip();
  update(d);
})
```

- [ ] **Step 5: 瀏覽器驗證**

1. Hover `推弦 Bending` → tooltip 顯示「🔗 點擊前往」+ `en.wikipedia.org`，cursor 為手型
2. 點擊 `推弦 Bending` → 開啟新分頁到 Wikipedia Guitar Technique
3. Hover `琴頭・琴頸・琴身`（無 url）→ tooltip 顯示純文字，cursor 為箭頭
4. 點擊 `琴頭・琴頸・琴身` → 無任何反應

- [ ] **Step 6: Commit**

```bash
git add guitar-learning-tree.html
git commit -m "feat: leaf nodes with url open wikipedia on click with link tooltip"
```

---

### Task 5: 全展開 / 全收合 Toggle 按鈕（Feature 2）

**Files:**
- Modify: `guitar-learning-tree.html` — HTML button 元素、CSS、JS helper 函式 + 事件

- [ ] **Step 1: 在 `<body>` 加入按鈕 DOM 元素**

在 `<div id="tooltip"></div>` 之後加入：

```html
<button id="expand-toggle" title="展開或收合全部節點">⊞ 展開全部</button>
```

- [ ] **Step 2: 在 CSS 加入按鈕樣式**

在 `/* ── Fixed bottom bar ──` 區塊之前加入：

```css
/* ── Expand toggle button ───────────────────────────────── */
#expand-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 30;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #334;
  background: rgba(10, 10, 24, 0.88);
  backdrop-filter: blur(8px);
  color: #99AAFF;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}
#expand-toggle:hover {
  background: rgba(30, 30, 60, 0.95);
  border-color: #6677EE;
}
```

- [ ] **Step 3: 加入 `expandAll` 和 `collapseAll` helper 函式**

緊接在 `collapseSubtree` 與 `expandLeftmostPath` 函式之後加入：

```js
function expandAll(node) {
  if (node._children) {
    node.children = node._children;
    node._children = null;
  }
  if (node.children) node.children.forEach(expandAll);
}

function collapseAll(node) {
  if (node.children && node.depth > 0) {
    node.children.forEach(collapseAll);
    node._children = node.children;
    node.children = null;
  } else if (node._children) {
    node._children.forEach(collapseAll);
  }
}
```

- [ ] **Step 4: 加入按鈕 toggle 事件**

在 `update(root);`（最後一行）之後加入：

```js
// ── Expand / Collapse All Button ─────────────────────────────────
let allExpanded = false;

document.getElementById('expand-toggle').addEventListener('click', () => {
  if (allExpanded) {
    collapseAll(root);
    allExpanded = false;
    document.getElementById('expand-toggle').textContent = '⊞ 展開全部';
  } else {
    expandAll(root);
    allExpanded = true;
    document.getElementById('expand-toggle').textContent = '⊟ 收合全部';
  }
  update(root);
});
```

- [ ] **Step 5: 瀏覽器驗證**

1. 頁面右下角應出現「⊞ 展開全部」按鈕
2. 點擊 → 全部節點展開，按鈕文字變為「⊟ 收合全部」
3. 再點擊 → 全部節點收合（depth > 0 全部收合），按鈕文字變回「⊞ 展開全部」
4. 收合後再手動展開部分節點，再點「⊟ 收合全部」→ 應全部收合

- [ ] **Step 6: Commit**

```bash
git add guitar-learning-tree.html
git commit -m "feat: add expand/collapse all toggle button at bottom-right"
```

---

## Self-Review Checklist

- [x] **Spec coverage**
  - Feature 1 (leaf URL): Task 1 (data) + Task 4 (CSS/JS/tooltip)
  - Feature 2 (toggle button): Task 5
  - Feature 3 (single-layer expand): Task 2
  - Feature 4 (leftmost path): Task 3
  - All spec requirements covered.

- [x] **Placeholder scan**: 無 TBD / TODO / "similar to above" 等。所有步驟均含完整程式碼。

- [x] **Type consistency**:
  - `collapseSubtree` 定義於 Task 2，使用於 Task 2 click handler 及 Task 5 `collapseAll`
  - `expandLeftmostPath` 定義於 Task 3，使用於 Task 3 init
  - `nodeClass` 修改於 Task 4，回傳值 `n-leaf-link` 對應 Task 4 CSS
  - `d.data.url` 於 Task 1 寫入 data，Task 4 `nodeClass`/`tooltipContent`/click handler 讀取
  - 命名一致無衝突。
