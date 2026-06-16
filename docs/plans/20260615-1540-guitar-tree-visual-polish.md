# Plan: 樹狀圖視覺優化 — 字體 / 顏色 / Hover Tooltip

## 需求討論摘要
使用者要求三項前端視覺更新：
1. 字體再放大一點
2. 深色模式文字顏色太不明顯，需提高亮度、稍減彩度
3. Hover 顯示 tooltip（節點摘要）+ cursor pointer / 放大鏡

## 目標
讓樹狀圖在深色背景下更易讀，節點互動感更強，hover 提供即時上下文。

## 設計 Spec（frontend-design skill 諮詢結果）

### 字體大小
| 節點類型 | 目前 | 新 |
|----------|------|----|
| 根節點   | 18px | 20px |
| 深度 1（群組）| 14px | 16px（靠 `.n-collapsed`/`.n-expanded` 覆蓋）|
| 一般節點 | 14px | 15px |
| 葉節點   | 13px | 14px |

### 文字顏色（更亮、彩度稍降）
| 節點狀態 | 目前 | 新 |
|----------|------|----|
| 根節點文字 | `#ff9a60` | `#FFAA70` |
| 已收起分支 | `#ff8855` | `#FF9977` |
| 已展開分支 | `#8899dd` | `#99AAFF` |
| 葉節點     | `#5baa5e` | `#6DCF70` |
| 一般節點   | `#b0b8cc` | `#C8D4E8` |

### 圓圈顏色（stroke 提亮）
| 節點狀態 | 目前 stroke | 新 stroke |
|----------|------------|-----------|
| 已收起 | `#ff5533` | `#FF6644` |
| 已展開 | `#3d52bb` | `#6677EE` |
| 葉節點 | `#2e8030` | `#44BB44` |

### Tooltip 設計
- **位置**：游標右上方偏移（+16px, -44px），`position: fixed` 跟著游標移動
- **外觀**：`rgba(10,10,24,0.92)` 背景 + `backdrop-filter: blur(8px)` + 1px border（顏色對應節點 stroke）+ border-radius 6px
- **內容邏輯**：
  - 已收起節點：`▲ 點擊展開` + 列出直接子節點名稱（最多 4 個，超過顯示 +N 更多）
  - 已展開節點：`▼ 點擊收起` + 子項目數量
  - 葉節點：完整標籤文字（因換行截斷可在此看全）
  - 根節點：靜態說明「電吉他學習路徑」
- **Cursor**：全節點 `cursor: pointer`

## 技術決策
- Tooltip 用 DOM `<div>` 而非 SVG `<foreignObject>`，定位更靈活
- 事件綁定在 `nodeEnter`，D3 datum 會即時反映 children/\_children 狀態
- 字體/顏色改 CSS，不動 JS

## 實作步驟
1. 更新 CSS：字體大小、文字顏色、圓圈 stroke 顏色
2. 加入 tooltip div HTML
3. 加入 tooltip CSS
4. JS 新增 `tooltipContent(d)` 函式
5. `nodeEnter` 加入 mouseover / mousemove / mouseout 事件

## 預期產出
- `guitar-learning-tree.html` 視覺更新
