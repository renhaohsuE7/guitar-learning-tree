# Design: 多樂器頁面 Routing + 爵士鼓技能樹

## 需求摘要

在現有「電吉他學習路徑」單頁視覺化之上,擴充為**多樂器**架構:

1. 新增頁面 routing,讓不同樂器各有獨立頁面與獨立網址。
2. 新增**爵士鼓**獨立技能樹頁面,沿用吉他的樹狀模板(共用 `script.js` / `style.css`)。
3. 新增**首頁導覽**(三張卡片風格),作為 GitHub Pages 進入點。
4. 貝斯(Bass)**本次跳過**,但架構需預留擴充位,日後補上成本最低。

鼓的課程內容與 leaf 連結取自使用者指定的 YouTube 來源(Hey! Guugo、Jemi 兩個頻道與相關 playlist),已用 `yt-dlp` 抽取並記錄於 `docs/references/external_sites/`。貝斯來源已先行蒐集,見 `docs/references/bass-reference-sources.md`(供日後建貝斯樹用)。

## 範圍

| 項目 | 本次 | 說明 |
| --- | --- | --- |
| 吉他頁 | ✅ 保留 | 由現有 `index.html` 改名為 `guitar.html`,資料改名為 `data-guitar.js` |
| 鼓頁 | ✅ 新增 | `drum.html` + `data-drum.js`,內容來自 Hey! Guugo + Jemi |
| 首頁導覽 | ✅ 新增 | 新 `index.html` + `landing.js`,兩張卡片(🎸 電吉他、🥁 鼓) |
| 樂器註冊表 | ✅ 新增 | `instruments.js`,首頁與樂器頁共用 |
| `script.js` 重構 | ✅ | 去除寫死的「電吉他」字串、新增導覽列渲染 |
| 貝斯頁 | ❌ 延後 | 註冊表預留註解;來源已蒐集。日後加 `data-bass.js` + `bass.html` + 清單一行即可 |

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

root `name = "爵士鼓學習"`。沿用吉他三大支幹。leaf 的 `url` 採 `https://www.youtube.com/watch?v=<id>`。內容整併兩個來源頻道,主題重複者一併保留(使用者要求):來源以 **(G)** = Hey! Guugo、**(J)** = Jemi 標示。共 **127** 個影片節點(G 55 + J 72)。

### 技術入門

- **基礎入門**
  - 認識套鼓 配置/音色 → `YbnPlxjFAqg` (G·空氣鼓棒 EP1)
  - 爵士鼓介紹+大鼓基礎踩法 → `joTW8k6iBMI` (J·零鼓打#6)
  - **握棒與運棒**
    - 握棒與運棒全攻略 → `V8nbn9ENdqI` (G)
    - 如何握拿鼓棒&基本練習 → `VvFUW4PNHZ8` (J·零鼓打#1)
    - 運棒四法+重音練習 → `pnb9r5N00lY` (J·零鼓打#9)
  - 手腳基本功・協調性 → `zBuyjr6wHEk` (G)
  - 練鼓後手部伸展運動 → `ciyZh0hZsOE` (J·親鼓#14)
- **基礎樂理與算拍**
  - 基本樂理與實戰 → `0UMCJA9a_Bc` (G·EP2)
  - 簡・鼓 基礎樂理篇 課程介紹 → `N6aGrcbIDH4` (J)
  - 音符+休止符 & 切分音+附點 → `d1s7mksGcBk` (J·零鼓打#2)
  - 數/算拍子 → `YwyANuQKu5Q` (J·零鼓打#3)
  - 拍號+節拍器介紹 → `nOO8j21nQuw` (J·零鼓打2.0#12)
  - 三連音介紹 → `YcWk2QblrrY` (J·零鼓打#5)
  - **算拍三循環** (G)
    - 三循環 pt.1 關於拍子的理解 → `VZ4vAhi7xtc`
    - 三循環 pt.2 完整的三循環 → `hCW4q5etT6k`
    - 關於算拍・對練習的好處 → `H4UubEFPwdQ`
    - 如何算歌的速度 → `jXMhziqWnO8`
- **基本技巧**
  - **打點 Rudiments**
    - 單擊、雙擊與輪鼓 → `A4kmAm2L2V0` (G·EP7)
    - 三連音 → `eHPhNOufWs4` (G·EP8)
    - 輕重音 → `uD5i9KDzzjw` (G·EP9)
    - Paradiddles 與應用 → `kuOKNhk1ods` (G·EP10)
    - 只能練打點也很開心(在家練) → `_kyGhECIEI0` (G)
    - 實用超順手打點 → `XaX3sGIeQZY` (G)
    - **零鼓打 打點訓練** (J)
      - 基礎節奏練習(16分/切分) → `-CoLqmq5v9M` (#4)
      - 輪鼓(輪音)+雙擊 → `oTrtgt6Jros` (#10)
      - 雙擊(點)練習(2) → `lIEHYkKeSs8` (#10.5)
      - Paradiddle 單雙擊複合 → `oeZDxcetSLM` (2.0#11)
      - 非慣用手(左手)強化 → `OGpi0rtSe_o` (2.0#13)
      - 基礎打點練習(2) → `mAi2btBX8FY` (2.0#14)
      - 基礎打點(3)重音 → `T6LfGhtX-_c` (2.0#15)
      - 三連音的練習 → `jBhRrnx1hWg` (2.0#16)
      - 六連音的練習 → `YpWdsOVbudg` (2.0#17)
      - 半拍三連音 → `7Jh8VbxUDYM` (2.0#18)
      - 重音練習(2) → `vCORwry-4VM` (2.0#19)
      - 暖身+速度練習 → `HIggo_DYCVE` (2.0#20)
      - 六連擊練習(2) → `jTlRk7CPM2c` (2.0#21)
      - 2連擊/3連擊打點 → `-poTSAodYCQ` (2.0#22)
      - Paradiddle 打點(2) → `UBdsOx0HbRU` (2.0#23)
  - **大鼓腳法**
    - 大鼓是用「甩」的・Heel Up 發力 → `ZcgN92XGNIk` (G)
    - 簡單大鼓變化的堆疊 → `362fBAYO0hY` (G)
    - 關於「大鼓」的練習 → `gyvxQArW5gw` (J·簡鼓#19)
    - 關於「大鼓」的練習(2) → `vm5CL2AgtNo` (J·簡鼓#20)
  - **基礎節奏入門**
    - 五個適合新手的入門節奏 → `3E6KKcjio-g` (G)
    - 常見節奏示範 4/8/16 beats → `2BazhiIbs0k` (G·EP3)
    - 進階節奏 → `SR80-05gZ0Y` (G·EP6)
    - 第一個節奏&樂曲結構&過門進入點 → `wXRpP63SZMs` (J·零鼓打#7)

### 音樂知識

- **節奏型 / 曲風 Pattern**
  - 8 Beat 的「微調」秘密 → `HhK1eJR9Ry4` (G)
  - 靈魂樂 Soul → `HvrSfL6QkVE` (J·簡鼓#1)
  - 妞妞 Twist / Rock'n'Roll → `m4Djd-90XH0` (J·簡鼓#2)
  - 迪斯可 Disco → `6Q-fY0z-3mA` (J·簡鼓#3)
  - 放克 Funk (1) → `PUFn0Ia-pws` (J·簡鼓#4)
  - 放克 Funk (2) 拆解 → `j1diCqtr6w4` (J·簡鼓#5)
  - 慢搖滾 Slow Rock / 抒情 → `a3MWVADMKXE` (J·簡鼓#6)
  - 摩城 Motown → `SRmsuRrL4Mk` (J·簡鼓#7)
  - 巴薩諾瓦 Bossa Nova → `oZH4qKlTYWE` (J·簡鼓#8)
  - 華爾滋 Waltz → `ToVYv50nTtc` (J·簡鼓#11)
  - 探戈 Tango + 裝飾音 Flam → `-JV_uAXgmBQ` (J·簡鼓#12)
  - 倫巴 Rumba → `WGBLY9i5nJM` (J·簡鼓#13)
  - 恰恰 Cha-Cha → `z9_cCxMw_ac` (J·簡鼓#14)
- **節奏理論 / 律動**
  - System & Syncopation 高效率練習 → `XojgBT--S0g` (G)
  - 鬼音 Ghost Note 小鼓切分 → `0avIv1q8vKY` (G)
  - 高階線性節奏 → `fOFZFrF57og` (G)
  - 時間扭曲・讓節奏變速 → `3sGkpdpf-9s` (G)
  - 伸縮「董次大次」聽覺錯覺 → `pK_RgKfEtxM` (G)
  - 改變 Ride 位置・讓節奏說話 → `RynGuAGnMrU` (G)
  - Unison 頻率學(鈸聲響) → `P5xp7B1kIjE` (G)
  - 關於「移位」練習 → `IEzyOO2hTSA` (J·簡鼓#18)
  - 關於「重音」的練習 → `kEwlAGSm6XM` (J·簡鼓#21)
- **過門 Fill**
  - 七個新手基本過門 → `zJ0a5vrA9rY` (G)
  - 兩個新手友善的過門 EP.1 → `3s2hmtD2UwQ` (G)
  - 4 分與 8 分音符組合過門 → `T5S03HJDw1s` (G·EP4)
  - 16 分音符拆點過門 → `vYA1bHAYlIQ` (G·EP5)
  - 積木造句法・神級過門 → `iuBmf0IQzWI` (G)
  - Tom 鼓不卡手的 3 個黃金軌跡 → `HymPf_6hc3M` (G)
  - 「3+3+3+3+4」公式 → `Dh87jq5nOas` (G)
  - 50 BPM 照妖鏡・打掉重練 → `P9Zsyw9_e7Y` (G)
  - 三個概念編四種過門設計 → `yENBkJAKZ4g` (G)
  - 爵士鼓過門概論 → `J4wquoDEFiI` (J·零鼓打#8)
  - 關於「過門」的練習 → `Dp70gKKDEFo` (J·簡鼓#17)
- **讀譜 / 採譜**
  - 關於「聽寫」鼓譜 → `_wsy7pjN-6U` (J·簡鼓#16)
  - 採譜/聽譜訓練-卡通歌(1) → `RfSmf5fZZEs` (J·親鼓#1)
  - 採譜/聽譜訓練-卡通歌(2) → `dvH06OZF54k` (J·親鼓#2)
  - 鼓譜 [米津玄師-Lemon] → `EkNwnzGjMLE` (J·#DrumScore)
  - 讀譜/視譜 [Scandal Baby] → `ftspGk3Yhfo` (J·簡鼓#22)
  - 讀譜/視譜 [米津玄師-Lemon] → `7Q6PSGW3txE` (J·簡鼓#23)
  - 讀譜/視譜 [櫻花結局] → `y0j_1RzpGpY` (J·簡鼓#24)

### 實踐應用

- **練習與速度**
  - 練不快缺的 3 個練習思維 → `EgUC3qhqnUg` (G)
  - 打的快之前要有的三個觀念 → `VGn6ZdljrH0` (G)
  - 四種提升速度的練習(上) → `kGVC2M5u5YE` (G)
  - 四種提升速度的練習(下) → `IxE53cqOOtk` (G)
  - 慢慢練 vs 原速練・練習實錄 → `MqpnU755fPA` (G)
  - 打快歌・180 BPM 優雅偷懶 → `R5k8Cxvnek4` (G)
  - 看了幾百部還打不好(一場實驗) → `7m-XS_mufgg` (G)
  - 免費 YT vs 付費課程・學習地圖 → `ZsW6g_NfXqA` (G)
  - 爵士鼓曲子練習三步驟 → `jZna6Lk13w8` (J·簡鼓#15)
- **即興演奏**
  - 3+1 架構即興實戰 → `b_XVNIXilzY` (G)
  - Panam Panic - Gravity 即興 → `tT_RwGbGyU8` (G)
- **周邊知識 / 打擊樂器** (J·親鼓系列)
  - 鼓如何調音＆鼓手必備小物 → `mC1zTgjXu38` (#6)
  - 幾種鈸的演奏方法 → `W6ByTWSqnLI` (#8)
  - 幾種沙鈴的介紹 → `L7gFAe2W4CA` (#9)
  - 聖誕雪鈴介紹 → `jBnklhg3WL0` (#12)
  - 在 KTV 鈴鼓打法 → `1WytcJ0ZeLc` (#4)
  - 木製打擊樂器介紹 → `lK454Vwlogw` (#3.5)
- **演奏與 Cover**
  - Makeba(輕鬆打系列) → `fy8uoJ3n6Sk` (G)
  - 夢醒時分 → `mcchGnKBSTA` (G)
  - New Jeans - ETA → `oaPebc2DDQM` (G)
  - NF - Trust 即興 → `FY2RQDTmUAQ` (G)
  - Smokepurpp - 6 Rings → `qTTxw2iufgE` (G)
  - pH1 - Cupid → `8oBQMRYil4s` (G)
  - Asiaboy 禁藥王 & Lizi - PIMP → `r_sGjMN_Yqs` (G)
  - Shinigami(Gravity Beats) → `30wVj3ZY0Ic` (G)
  - Dark Charybdis - Spawned in Sin(live) → `-IMzpVsVYwU` (G)
  - **玩月樂 創意演奏** (J)
    - 但願人長久(Cup+Glass) → `7LyQsdl5MrQ` (#1)
    - Cup song 杯子歌怎麼玩 → `br_w6J3qt44` (#2)
    - 聖誕組曲(Piano & Drum) → `htGa7CmrMC4` (#3)
    - River Dance 大河之舞 → `tV_BOKqmpug` (#4)
    - ASMR 用海浪聲做節奏 → `WkjfkQS54Ns` (#5)
    - Drum Cover Scandal Baby → `cjRleo1xDQU` (#6)
    - 沖繩 三線&Cajon cover → `6SPQpHCUSi0` (J·親鼓#15)
- **鼓手見聞 / 樂器巡禮(Vlog)** (J)
  - 韓國大邱鼓專賣店 → `bSTv_kriKK4` (親鼓#3)
  - 溫哥華 Rufus Drum Shop → `M4Wmq2G2dIA` (親鼓#5)
  - 紐約 Sam Ash music stores → `hYfN1nnnNZQ` (親鼓#5.5)
  - 世界最大樂器商城・樂園商街 → `mFwCLXfQofg` (親鼓#11)
  - 專訪韓國鼓手 고니 → `FFcfYLgjYQc` (親鼓#10)
  - 音樂旅程分享會 → `8ALoAeP7R7U` (親鼓#7)
  - 鼓錄音側拍 → `VCEsnvvbras`
  - 德國尋音之旅 → `IxAXuRs0mfo`

> Jemi 頻道 4 部純頻道公告/雜談不採用:`XCG9ZsFKh9M`、`_WHzjqFSqD4`、`V0SwgCyraP0`、`oP513dOckgU`(已記於研究筆記)。Hey! Guugo 招生宣傳 `p7FXYxnVhsg` 亦不採用。其餘 G 55 + J 72 = **127** 個影片皆已分配到節點(技術入門 46 / 音樂知識 40 / 實踐應用 41)。

## 內容來源與研究

抽取工具:`yt-dlp`(透過 `uvx yt-dlp` 執行;符合「用 uv + python」之要求)。為避免 Windows 主控台 Big5 解碼造成中文亂碼,使用 `--print-to-file` 寫 UTF-8 檔再讀取。研究筆記:

- [[2026-06-22-youtube-hey-guugo-channel]] — Hey! Guugo 頻道(主來源,56 部)
- [[2026-06-22-youtube-playlist-jazz-drum-24]] — 「24堂 爵士鼓演奏課 剪輯版」(11 部)
- [[2026-06-22-youtube-playlist-happy-drum]] — 「快樂學打鼓系列」(2 部 Cover)
- [[2026-06-22-youtube-drummer-jemi-channel]] — Jemi 爵士鼓教學頻道(76 部,72 採用)

貝斯來源(本次不建樹,先蒐集):見 `docs/references/bass-reference-sources.md`。

## 技術決策

- **多檔 HTML** 而非 SPA hash router:最貼近現有靜態架構、每樂器有獨立網址、GitHub Pages 直接可用。
- **`instruments.js` 註冊表 + `<body data-instrument>`**:單一資料來源,首頁與樂器頁共用,新增樂器成本最低。
- **leaf URL 用 `watch?v=<id>`**:與既有 `data-guitar.js` 格式一致。
- **`yt-dlp` 經 `uvx` 執行**:免全域安裝;`--print-to-file` 確保 UTF-8。
- **依主題整併雙頻道、保留主題重複**:同主題(如過門、三連音、Paradiddle、大鼓)兩頻道版本並列為相鄰 leaf,符合使用者「重複也記錄」要求,且學習者可比較不同講法。
- **純頻道公告排除**:里程碑/抽獎/Q&A 等無學習價值者不入樹,但全數記於研究筆記。
- **貝斯延後**:以註解預留,不寫空殼頁面(YAGNI);來源先蒐集備用。

## 不在範圍(本次)

- 貝斯頁與貝斯課程內容(來源已蒐集,建樹延後)。
- 影片內容驗證/逐部觀看(僅採用標題與 ID;標題已足以歸類)。
- 任何打包、框架、後端或下載影片本身。

## 預期產出

- 新 `index.html`(卡片導覽)+ `landing.js`。
- `guitar.html`(改名)+ `data-guitar.js`(改名),功能與現狀一致。
- `drum.html` + `data-drum.js`(依上述藍圖,含 127 個 YouTube leaf 連結)。
- `instruments.js`、`script.js`(重構)、`style.css`(新增樣式)。
- 研究筆記:4 則鼓來源(已完成)+ 貝斯來源 doc(本次新增)。
- 更新 `CLAUDE.md` 反映多頁架構。
