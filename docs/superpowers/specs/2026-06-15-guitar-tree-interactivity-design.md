# Design: Guitar Tree Interactivity — 4 功能擴充

## 需求摘要

使用者要求為 `guitar-learning-tree.html` 新增四項互動功能：

1. **Leaf URL 連結**：子葉末端節點可點擊開啟對應網頁，hover 顯示目標網站名稱
2. **全展開/收合 Toggle 按鈕**：固定在右下角，一鍵切換全樹展開或全樹收合
3. **單層展開**：點擊節點只展開下一層，收合時遞迴重置所有子樹狀態
4. **預設展開最左路徑**：頁面開啟時，自動沿最左側路徑展開到最後一個葉節點

## Feature 1 — Leaf node URL 連結

### 資料層變更

在 `data` 的特定 leaf node 加上 `url` 欄位（來源：`docs/references/external_sites/`）：

**Wikipedia Guitar Technique** (`https://en.wikipedia.org/wiki/Guitar_technique`):
- 推弦 Bending、滑弦 Slide / Glissando、捶弦 Hammer-on、勾弦 Pull-off
- 顫音 Vibrato、點弦 Tapping（進階）
- 撥片握法與角度、交替撥弦 Alternate Picking
- 掌側悶音 Palm Mute、指彈 Fingerpicking、掃弦技 Sweep Picking（進階）

**Wikipedia Guitar Amplifier** (`https://en.wikipedia.org/wiki/Guitar_amplifier`):
- 真空管音箱 Tube Amp、電晶體音箱 Solid State、數位模擬 Kemper / HX Stomp

**Wikipedia Blues Scale** (`https://en.wikipedia.org/wiki/Blues_scale`):
- 藍調音階 Blues Scale

無 URL 的 leaf node 維持現有行為（不可點擊開連結）。

### 行為

- 有 `url` 的 leaf node：加上 `n-leaf-link` class，CSS `.node.n-leaf-link { cursor: pointer }`，點擊 `window.open(url, '_blank')`
- 無 `url` 的 leaf node：維持 `n-leaf` class，CSS `.node.n-leaf { cursor: default }` 覆蓋全域 pointer
- Tooltip：有 URL 時顯示 `🔗 點擊前往` + 精簡域名（`en.wikipedia.org`）

## Feature 2 — 全展開 / 全收合 Toggle 按鈕

### UI

```
position: fixed; bottom: 24px; right: 24px
```

- 初始狀態：`⊞ 展開全部`
- 點擊後切換：`⊟ 收合全部`
- z-index 高於 hint-bar

### 邏輯

```
expandAll(node):
  if node._children: node.children = node._children; node._children = null
  forEach child in (node.children || []): expandAll(child)

collapseAll(node):
  if node.children && node.depth > 0:
    forEach child: collapseAll(child)
    node._children = node.children; node.children = null
  elif node._children:
    forEach child: collapseAll(child)
```

切換後呼叫 `update(root)` 並更新按鈕文字。

## Feature 3 — 收合時重置子樹（單層展開保證）

### 新增 helper

```
collapseSubtree(node):
  if node.children:
    forEach child: collapseSubtree(child)
    node._children = node.children
    node.children = null
```

### 修改 click handler

```js
.on("click", (event, d) => {
  if (d.data.url && !d.children && !d._children) {
    window.open(d.data.url, '_blank');
    return;
  }
  if (d.children) {
    collapseSubtree(d);           // 遞迴重置
  } else if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  hideTooltip();
  update(d);
})
```

## Feature 4 — 預設展開最左路徑

在初始狀態設定（depth 2+ 全收合）之後執行：

```
expandLeftmostPath(node):
  const pool = node._children || node.children
  if not pool or pool.length === 0: return
  if node._children:
    node.children = node._children; node._children = null
  expandLeftmostPath(node.children[0])
```

最左路徑：`🎸 電吉他學習` → `技術入門` → `基礎入門` → `認識吉他結構` → `琴頭・琴頸・琴身`

## 技術決策

- URL 開啟用 `window.open(url, '_blank')`，不用 `<a>` tag（維持 SVG 節點架構）
- collapseSubtree 用遞迴 DFS（樹深度有限，不需 BFS queue）
- expandAll / collapseAll 同樣用遞迴 DFS
- 全展開 Toggle 按鈕用 DOM `<button>`，不用 SVG

## 預期產出

- `guitar-learning-tree.html` 包含上述全部 4 項功能
