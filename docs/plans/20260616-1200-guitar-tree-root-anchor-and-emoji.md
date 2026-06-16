# Plan: Root 錨定底部 + Emoji 移除 + 樹向上生長

## 需求討論摘要
1. 移除所有 emoji（🎸、🔗）
2. Root node 預設在畫面底部約 10%（margin.bottom = vh * 0.1）
3. 展開/收合節點時，整棵樹的位置不應改變——樹往上長，超過 viewport 就讓 user 自己往上捲

## 目標
讓樹的根節點永遠停在畫面底部 10% 處，展開/收合只改變樹往上延伸的高度，不影響 root 的 viewport 位置。

## 設計 Spec

### Emoji 移除
- `<title>` 移除 🎸
- `data.name` 移除 🎸
- `tooltipContent()` root case 移除 🎸
- `tooltipContent()` leaf-link case 移除 🔗

### Root 位置
- `margin.bottom = Math.round(window.innerHeight * 0.1)`
- SVG 最小高度 = `window.innerHeight`（確保初始狀態 root 在正確位置）
  - `svgH = Math.max(maxY + margin.top + margin.bottom, window.innerHeight)`
- 初始 scroll：`window.scrollTo(0, svgH - window.innerHeight)` 讓 root 停在 90% viewport

### 展開/收合不移位
- 當 svgH 改變（delta = svgH - prevSvgH）→ scrollBy(delta) 補償
- 用 `requestAnimationFrame` 包裹 scrollBy，避免 SVG resize 和 scroll 的渲染競態
- 加 `html { overflow-anchor: none; }` CSS 防止瀏覽器自動 scroll anchoring 干擾

## 技術決策
- `overflow-anchor: none`：讓瀏覽器不自動補償 scroll，改由我們的 scrollBy 控制
- SVG 最小高度 = window.innerHeight：確保初始時 root 在 10% 底部（不依賴 scrollTo）
- rAF 包 scrollBy：等待 SVG DOM 更新後再調整 scroll

## 檔案拆分
使用者另要求將單一 HTML 拆成獨立檔案：
- `guitar-learning-tree.html` — 僅 HTML 結構，link CSS/JS
- `style.css` — 所有樣式
- `data.js` — 樹狀資料（全域變數 `const data = {...}`，不用 module，確保 file:// 協議可直接開啟）
- `script.js` — D3 邏輯

## 實作步驟
1. 建立 `style.css`（含 overflow-anchor rule）
2. 建立 `data.js`（emoji 已移除）
3. 建立 `script.js`（root anchor + scrollBy rAF 修正）
4. 更新 `guitar-learning-tree.html` 連結三個外部檔案

## 預期產出
- `guitar-learning-tree.html`（精簡版）
- `style.css`
- `data.js`
- `script.js`
