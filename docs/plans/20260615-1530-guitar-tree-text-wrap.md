# Plan: 節點文字超過 5 字自動換行

## 需求討論摘要
使用者要求：節點 label 超過 5 個字（Unicode 字元）自動換行，每行最多 5 字。

## 目標
所有樹狀節點的文字標籤，超過 5 個字元時自動分行顯示。

## 設計 Spec

- 每行最多 5 個字元（以 Unicode code point 計算，emoji 算 1 個）
- 對齊方式：`text-anchor: middle`，每行都置中於節點圓心
- 行距：`1.3em`
- 適用所有節點（根節點、分支、葉節點）

### 範例
| 原文 | 換行後 |
|------|--------|
| `琴頭・琴頸・琴身` | `琴頭・琴頸・` / `琴身` |
| `🎸 電吉他學習` | `🎸 電吉他` / `學習` |
| `調音` | `調音`（不換行）|

## 技術決策

SVG `<text>` 不支援原生換行，必須手動拆 `<tspan>`：

```javascript
function wrapText(selection) {
  const MAX = 5;
  selection.each(function(d) {
    const el    = d3.select(this);
    const r     = nodeRadius(d);
    const chars = [...d.data.name]; // 用 spread 確保 emoji 算 1 字

    el.text(null); // 清除舊內容（含舊 tspan）

    const lines = [];
    for (let i = 0; i < chars.length; i += MAX) {
      lines.push(chars.slice(i, i + MAX).join(""));
    }

    lines.forEach((line, i) => {
      el.append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? r + 14 : "1.3em")
        .text(line);
    });
  });
}
```

- Enter 和 update 時都呼叫 `wrapText`
- `<text>` 元素本身不設 `dy`（交給第一個 tspan）

## 實作步驟
1. 新增 `wrapText(selection)` 函式
2. 節點 enter 時改用 `.call(wrapText)` 取代 `.text(...)`
3. nodeUpdate 的 text 也改用 `.call(wrapText)`
4. 移除 `text` 元素上的 `.attr("dy", ...)` 設定

## 預期產出
- `guitar-learning-tree.html` 所有節點文字自動換行
