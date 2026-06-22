# Design: 多樂器頁面 Routing + 爵士鼓技能樹

## 需求摘要

在現有「電吉他學習路徑」單頁視覺化之上,擴充為**多樂器**架構:

1. 新增頁面 routing,讓不同樂器各有獨立頁面與獨立網址。
2. 新增**爵士鼓**獨立技能樹頁面,沿用吉他的樹狀模板(共用 `script.js` / `style.css`)。
3. 新增**首頁導覽**(三張卡片風格),作為 GitHub Pages 進入點。
4. 貝斯(Bass)**本次跳過**,但架構需預留擴充位,日後補上成本最低。

鼓的課程內容與 leaf 連結取自使用者指定的 YouTube 來源(Hey! Guugo 頻道與兩個 playlist),已用 `yt-dlp` 抽取並記錄於 `docs/references/external_sites/`。

## 範圍

| 項目 | 本次 | 說明 |
| --- | --- | --- |
| 吉他頁 | ✅ 保留 | 由現有 `index.html` 改名為 `guitar.html`,資料改名為 `data-guitar.js` |
| 鼓頁 | ✅ 新增 | `drum.html` + `data-drum.js`,內容來自 Hey! Guugo |
| 首頁導覽 | ✅ 新增 | 新 `index.html` + `landing.js`,兩張卡片(🎸 電吉他、🥁 鼓) |
| 樂器註冊表 | ✅ 新增 | `instruments.js`,首頁與樂器頁共用 |
| `script.js` 重構 | ✅ | 去除寫死的「電吉他」字串、新增導覽列渲染 |
| 貝斯頁 | ❌ 延後 | 註冊表預留註解;日後加 `data-bass.js` + `bass.html` + 清單一行即可 |

## 架構

### 設計原則

- **純靜態、無建置、相容 GitHub Pages**:維持現有「HTML + 全域 `data` + D3(CDN)」模式,不引入打包工具或框架。
- **獨立 HTML 多檔 routing**:每個樂器一個 `.html`,各有獨立網址(`guitar.html` / `drum.html`),首頁 `index.html` 做卡片導覽。不寫客製 SPA router。
- **單一資料來源(DRY)**:樂器清單集中在 `instruments.js`,首頁與各樂器頁共用;新增樂器只動這一份清單 + 一支 data 檔 + 一個 html。
- **渲染邏輯零改動風險**:D3 樹的核心(三狀態收合 `children`/`_children`/`_initHidden`、bottom-up 版面、文字換行、tooltip)維持不動,只抽掉寫死的樂器名稱。

### 檔案結構

```
index.html        ← 新首頁:卡片導覽(GitHub Pages 進入點)
landing.js        ← 新增:讀 INSTRUMENTS 渲染卡片
guitar.html       ← 由舊 index.html 改名(吉他樹)
drum.html         ← 新增(鼓樹)
data-guitar.js    ← 由舊 data.js 改名
data-drum.js      ← 新增(鼓課程樹,含 YouTube leaf URL)
instruments.js    ← 新增:樂器註冊表(首頁 + 各樂器頁共用)
script.js         ← 共用,小幅重構
style.css         ← 共用,新增首頁卡片 + 導覽列樣式
```

> 未來加貝斯:新增 `bass.html`、`data-bass.js`,在 `instruments.js` 加一行,完工。

### 樂器註冊表 `instruments.js`

```js
const INSTRUMENTS = [
  { id: 'guitar', label: '電吉他', emoji: '🎸', page: 'guitar.html' },
  { id: 'drum',   label: '鼓',     emoji: '🥁', page: 'drum.html'   },
  // 日後擴充:{ id: 'bass', label: '貝斯', emoji: '🎵', page: 'bass.html' },
];
```

- 首頁 `landing.js`:遍歷 `INSTRUMENTS` 生成卡片。
- 樂器頁:遍歷 `INSTRUMENTS` 生成導覽列(返回首頁 + 樂器切換鈕,高亮當前)。

### 首頁 `index.html` + `landing.js`

- 沿用深色主題(`style.css`)。標題「樂器學習路徑」。
- `landing.js` 依 `INSTRUMENTS` 渲染卡片;每張卡片是 `<a href="{page}">`,內含 `{emoji}` 與 `{label}`,點擊進入該樂器頁。
- 卡片置中、深色半透明、hover 高亮,風格對齊既有 `#expand-toggle` 按鈕。

### 導覽列(各樂器頁)

- 固定左上角,深色半透明、與 `#expand-toggle` 同風格,`z-index` 高於 hint-bar。
- 內容:`← 首頁`(連回 `index.html`) + 樂器切換鈕(🎸 🥁,當前樂器高亮、非連結)。
- 由 `script.js` 依 `<body data-instrument="...">` 判斷當前樂器後動態渲染(各頁不重複手寫導覽列 HTML)。

### `script.js` 重構

只做兩類最小改動,不碰樹渲染演算法:

1. **去除寫死字串**:`tooltipContent` 中 depth-0 回傳的「電吉他學習路徑」改讀 `root.data.name`(或對應 INSTRUMENTS label)。
2. **新增導覽列渲染**:啟動時讀 `document.body.dataset.instrument`,於 `INSTRUMENTS` 找到當前項,動態建立左上導覽列 DOM 並高亮當前樂器。

各樂器頁 `<body data-instrument="guitar">` / `"drum"`,並依序載入:D3(CDN)→ `instruments.js` → `data-<id>.js` → `script.js`。

### `style.css` 新增

- `.landing` / `.card`:首頁卡片版面(flex 置中、卡片邊框/hover)。
- `.nav-bar` / `.nav-home` / `.nav-switch`:左上導覽列與切換鈕(沿用既有色票與 backdrop-blur)。
- 既有 `.node` / `.link` / `#tooltip` / `#expand-toggle` / `.hint-bar` 樣式不變。

## 鼓課程樹內容 `data-drum.js`(藍圖)

root `name = "爵士鼓學習"`。沿用吉他三大支幹。leaf 的 `url` 採 `https://www.youtube.com/watch?v=<id>`。內容來源見「內容來源」一節;影片 ID 對照如下。

### 技術入門

- **基礎入門**
  - 認識套鼓 配置/音色/常用方式 → `YbnPlxjFAqg`(空氣鼓棒 EP1)
  - 握棒與運棒全攻略(第一堂課) → `V8nbn9ENdqI`
  - 基本樂理與實戰 → `0UMCJA9a_Bc`(EP2)
  - 手腳基本功・協調性 → `zBuyjr6wHEk`
  - **算拍與拍子理解**
    - 三循環 pt.1 關於拍子的理解 → `VZ4vAhi7xtc`
    - 三循環 pt.2 完整的三循環 → `hCW4q5etT6k`
    - 關於算拍・對練習的好處 → `H4UubEFPwdQ`
    - 如何算歌的速度 → `jXMhziqWnO8`
- **基本技巧**
  - **打點 Rudiments**
    - 單擊、雙擊與輪鼓 → `A4kmAm2L2V0`(EP7)
    - 三連音 → `eHPhNOufWs4`(EP8)
    - 輕重音 → `uD5i9KDzzjw`(EP9)
    - Paradiddles 與應用 → `kuOKNhk1ods`(EP10)
    - 只能練打點也很開心(在家練) → `_kyGhECIEI0`
    - 實用超順手打點 → `XaX3sGIeQZY`
  - **大鼓腳法**
    - 大鼓是用「甩」的・Heel Up 發力 → `ZcgN92XGNIk`
    - 簡單大鼓變化的堆疊 → `362fBAYO0hY`
  - **基礎節奏**
    - 五個適合新手的入門節奏 → `3E6KKcjio-g`
    - 常見節奏示範 4/8/16 beats → `2BazhiIbs0k`(EP3)
    - 進階節奏 → `SR80-05gZ0Y`(EP6)

### 音樂知識

- **節奏理論**
  - 8 Beat 的「微調」秘密 → `HhK1eJR9Ry4`
  - System & Syncopation 高效率練習 → `XojgBT--S0g`
  - 鬼音 Ghost Note 小鼓切分 → `0avIv1q8vKY`
  - 高階線性節奏 → `fOFZFrF57og`
  - 時間扭曲・讓節奏變速 → `3sGkpdpf-9s`
  - 伸縮「董次大次」聽覺錯覺 → `pK_RgKfEtxM`
  - 改變 Ride 位置・讓節奏說話 → `RynGuAGnMrU`
  - Unison 頻率學(鈸聲響) → `P5xp7B1kIjE`
- **過門 Fill**
  - 七個新手基本過門 → `zJ0a5vrA9rY`
  - 兩個新手友善的過門 EP.1 → `3s2hmtD2UwQ`
  - 4 分與 8 分音符組合過門 → `T5S03HJDw1s`(EP4)
  - 16 分音符拆點過門 → `vYA1bHAYlIQ`(EP5)
  - 積木造句法・神級過門 → `iuBmf0IQzWI`
  - Tom 鼓不卡手的 3 個黃金軌跡 → `HymPf_6hc3M`
  - 「3+3+3+3+4」公式 → `Dh87jq5nOas`
  - 50 BPM 照妖鏡・打掉重練 → `P9Zsyw9_e7Y`
  - 三個概念編四種過門設計 → `yENBkJAKZ4g`

### 實踐應用

- **練習與速度**
  - 練不快缺的 3 個練習思維 → `EgUC3qhqnUg`
  - 打的快之前要有的三個觀念 → `VGn6ZdljrH0`
  - 四種提升速度的練習(上) → `kGVC2M5u5YE`
  - 四種提升速度的練習(下) → `IxE53cqOOtk`
  - 慢慢練 vs 原速練・練習實錄 → `MqpnU755fPA`
  - 打快歌・180 BPM 優雅偷懶 → `R5k8Cxvnek4`
  - 看了幾百部還打不好(一場實驗) → `7m-XS_mufgg`
  - 免費 YT vs 付費課程・學習地圖 → `ZsW6g_NfXqA`
- **即興演奏**
  - 3+1 架構即興實戰 → `b_XVNIXilzY`
  - Panam Panic - Gravity 即興 → `tT_RwGbGyU8`
- **演奏與 Cover**
  - Makeba(輕鬆打系列) → `fy8uoJ3n6Sk`
  - 夢醒時分 → `mcchGnKBSTA`
  - New Jeans - ETA → `oaPebc2DDQM`
  - NF - Trust 即興 → `FY2RQDTmUAQ`
  - Smokepurpp - 6 Rings → `qTTxw2iufgE`
  - pH1 - Cupid → `8oBQMRYil4s`
  - Asiaboy 禁藥王 & Lizi - PIMP → `r_sGjMN_Yqs`
  - Shinigami(Gravity Beats) → `30wVj3ZY0Ic`
  - Dark Charybdis - Spawned in Sin(live) → `-IMzpVsVYwU`

> 影片 `p7FXYxnVhsg`(招生宣傳)不採用。全部 55 個可用影片皆已分配到節點。

## 內容來源與研究

抽取工具:`yt-dlp`(透過 `uvx yt-dlp` 執行;符合「用 uv + python」之要求)。為避免 Windows 主控台 Big5 解碼造成中文亂碼,使用 `--print-to-file` 寫 UTF-8 檔再讀取。研究筆記:

- [[2026-06-22-youtube-hey-guugo-channel]] — Hey! Guugo 頻道(主來源,56 部)
- [[2026-06-22-youtube-playlist-jazz-drum-24]] — 「24堂 爵士鼓演奏課 剪輯版」(11 部)
- [[2026-06-22-youtube-playlist-happy-drum]] — 「快樂學打鼓系列」(2 部 Cover)

## 技術決策

- **多檔 HTML** 而非 SPA hash router:最貼近現有靜態架構、每樂器有獨立網址、GitHub Pages 直接可用。
- **`instruments.js` 註冊表 + `<body data-instrument>`**:單一資料來源,首頁與樂器頁共用,新增樂器成本最低。
- **leaf URL 用 `watch?v=<id>`**:與既有 `data-guitar.js` 格式一致。
- **`yt-dlp` 經 `uvx` 執行**:免全域安裝;`--print-to-file` 確保 UTF-8。
- **貝斯延後**:以註解預留,不寫空殼頁面(YAGNI)。

## 不在範圍(本次)

- 貝斯頁與貝斯課程內容。
- 影片內容驗證/逐部觀看(僅採用標題與 ID;標題已足以歸類)。
- 任何打包、框架、後端或下載影片本身。

## 預期產出

- 新 `index.html`(卡片導覽)+ `landing.js`。
- `guitar.html`(改名)+ `data-guitar.js`(改名),功能與現狀一致。
- `drum.html` + `data-drum.js`(依上述藍圖,含 55 個 YouTube leaf 連結)。
- `instruments.js`、`script.js`(重構)、`style.css`(新增樣式)。
- 三則研究筆記(已完成)。
- 更新 `CLAUDE.md` 反映多頁架構。
