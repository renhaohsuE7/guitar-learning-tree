# Plan: 電吉他學習樹狀圖 — 由下往上版面

- **日期**：2026-06-15 15:00
- **目標**：將原本左右橫向的樹狀圖改為由下往上垂直生長，頁面載入後從根節點（最底部）開始，向上捲動逐漸看到更多分支。

## 需求

1. 樹狀圖方向：根節點在底部，子節點往上展開
2. 頁面載入後自動捲到最底部
3. 向上捲動即可逐漸看到各學習層次
4. Toggle 展開/收起功能保留
5. 展開時頁面捲軸位置要跟著補償，讓根節點不跑版

## 技術決策

| 項目 | 決策 | 原因 |
|------|------|------|
| D3 layout | `d3.tree().nodeSize([NODE_W, LEVEL_H])` 保持不變 | 僅翻轉座標，不換 layout 引擎 |
| Y 軸翻轉 | 節點 transform 用 `translate(d.x, -d.y)` | d3-y 為深度值（正數往下），取負數即往上 |
| 根節點定位 | `g` transform: `translate(gX, svgH - margin.bottom)` | 讓 root 固定在 SVG 底部 |
| 捲軸補償 | `window.scrollBy({ top: delta })` | svgH 增長時同步往下捲，保持根節點視窗位置不變 |
| Link 路徑 | `d3.linkVertical().x(d=>d.x).y(d=>-d.y)` | 產生往上的 S 曲線連結 |
| 初始捲動 | `requestAnimationFrame(() => scrollTo(0, scrollHeight))` | 等 SVG render 完才捲，避免時序問題 |
| 初始展開層 | depth 0+1 open，depth 2+ collapsed | 給使用者先看到 6 大主幹，點擊後展開細節 |

## 視覺設計

- 頂部漸層遮罩（`body::before`）：暗示上方還有更多內容
- 底部固定 hint bar：「↑ 向上捲動探索更多層次」
- Link 線加 glow 濾鏡，顏色依深度層次變化
- 節點圓圈大小依深度：root=11, depth1=8, depth2+=6

## 產出

- 修改檔案：`guitar-learning-tree.html`
