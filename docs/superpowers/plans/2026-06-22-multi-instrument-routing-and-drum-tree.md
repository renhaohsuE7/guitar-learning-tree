# Multi-Instrument Routing + Drum Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-page guitar learning tree into a multi-instrument static site with a card landing page, per-instrument pages (guitar + drum), and a shared tree renderer.

**Architecture:** Separate HTML file per instrument (`guitar.html`, `drum.html`), each declaring `<body data-instrument="...">` and loading a shared `instruments.js` registry, its own `data-<id>.js`, and the shared `script.js`. A new `index.html` landing page renders instrument cards from the same registry. `script.js` is refactored to read the root title from data and to render a top-left nav bar from the registry. No D3 tree-rendering logic changes.

**Tech Stack:** Plain HTML/CSS/JS, D3 v7 (CDN), no build system, no package manager, no test framework. GitHub Pages deploy. Python 3.11 available for data validation.

## Global Constraints

- Pure static site: no build step, no bundler, no framework. D3 v7 loaded from `https://d3js.org/d3.v7.min.js`.
- All user-facing copy is Traditional Chinese (`zh-TW`).
- Leaf video links use exactly `https://www.youtube.com/watch?v=<id>` where `<id>` is an 11-char YouTube id (`[A-Za-z0-9_-]{11}`).
- `script.js` and `style.css` are shared by every instrument page. Do NOT fork them per instrument.
- Per-page load order is fixed: D3 (CDN) → `instruments.js` → `data-<id>.js` → `script.js`.
- Do NOT change the D3 tree algorithm (three-state collapse `children`/`_children`/`_initHidden`, bottom-up layout, `wrapText`, scroll anchoring). Only the two refactors in Task 3 and Task 6 touch `script.js`.
- Drum tree contains exactly **127** leaf videos (Hey! Guugo 55 + Jemi 72), all unique. Full mapping: spec §鼓課程樹內容.
- Conventional Commits. Work happens on branch `feat/multi-instrument-drum` (already created).
- Authoritative content source: `docs/superpowers/specs/2026-06-22-multi-instrument-routing-and-drum-tree-design.md`.

---

## File Structure

| File | Action | Responsibility |
| --- | --- | --- |
| `instruments.js` | Create | `const INSTRUMENTS` registry (id/label/emoji/page). Single source of truth. |
| `guitar.html` | Rename from `index.html` + edit | Guitar tree page; `data-instrument="guitar"`, loads `data-guitar.js`. |
| `data-guitar.js` | Rename from `data.js` | Guitar curriculum data (unchanged content). |
| `drum.html` | Create | Drum tree page; `data-instrument="drum"`, loads `data-drum.js`. |
| `data-drum.js` | Create | Drum curriculum data, 127 YouTube leaf links. |
| `index.html` | Create (new) | Landing page; renders cards via `landing.js`. |
| `landing.js` | Create | Builds instrument cards from `INSTRUMENTS`. |
| `script.js` | Modify | Read root title from data (Task 3); render nav bar (Task 6). |
| `style.css` | Modify | Add `.landing`/`.card` (Task 7) and `.nav-bar` (Task 6) styles. |
| `CLAUDE.md` | Modify | Document multi-page architecture (Task 8). |

---

### Task 1: Instrument registry (`instruments.js`)

**Files:**
- Create: `instruments.js`

**Interfaces:**
- Produces: global `const INSTRUMENTS` — array of `{ id: string, label: string, emoji: string, page: string }`. Consumed by `landing.js` (Task 7) and `script.js` nav (Task 6).

- [ ] **Step 1: Write the registry file**

Create `instruments.js`:

```js
// Single source of truth for the instruments shown on the landing page
// and in each instrument page's nav bar. Add a new instrument here +
// one data-<id>.js + one <id>.html to extend the site.
const INSTRUMENTS = [
  { id: 'guitar', label: '電吉他', emoji: '🎸', page: 'guitar.html' },
  { id: 'drum',   label: '鼓',     emoji: '🥁', page: 'drum.html'   },
  // 日後擴充:{ id: 'bass', label: '貝斯', emoji: '🎵', page: 'bass.html' },
];
```

- [ ] **Step 2: Verify it parses**

Run (Bash):
```bash
node -e "eval(require('fs').readFileSync('instruments.js','utf8')); console.log(INSTRUMENTS.length, INSTRUMENTS.map(i=>i.id).join(','))" 2>/dev/null \
  || python -c "import re;s=open('instruments.js',encoding='utf-8').read();print('guitar' in s and 'drum' in s and 'INSTRUMENTS' in s)"
```
Expected: prints `2 guitar,drum` (node) or `True` (python fallback).

- [ ] **Step 3: Commit**

```bash
git add instruments.js
git commit -m "feat: add instruments registry"
```

---

### Task 2: Rename guitar page + data, wire registry

**Files:**
- Rename: `index.html` → `guitar.html`
- Rename: `data.js` → `data-guitar.js`
- Modify: `guitar.html` (body attr + script tags)

**Interfaces:**
- Consumes: `INSTRUMENTS` (Task 1), `data-guitar.js` (global `data`), `script.js`.
- Produces: a working `guitar.html` declaring `data-instrument="guitar"`.

- [ ] **Step 1: Rename files with git**

```bash
git mv index.html guitar.html
git mv data.js data-guitar.js
```

- [ ] **Step 2: Update `guitar.html` body + script tags**

In `guitar.html`, change the `<body>` open tag and the bottom scripts.

Replace:
```html
<body>
```
with:
```html
<body data-instrument="guitar">
```

Replace:
```html
<script src="data.js"></script>
<script src="script.js"></script>
```
with:
```html
<script src="instruments.js"></script>
<script src="data-guitar.js"></script>
<script src="script.js"></script>
```

(Leave the `<title>電吉他學習路徑</title>` and the D3 CDN `<script>` in `<head>` unchanged.)

- [ ] **Step 3: Verify guitar page still renders**

Run (Bash), then open the page:
```bash
python -m http.server 8000
```
Open `http://localhost:8000/guitar.html`. Expected: the guitar tree renders exactly as before (root "電吉他學習" anchored near bottom, leftmost path expanded, click/expand works). Stop the server with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add guitar.html data-guitar.js
git commit -m "refactor: rename guitar page/data and load instruments registry"
```

---

### Task 3: `script.js` — dynamic root title

**Files:**
- Modify: `script.js:33-36` (`tooltipContent` depth-0 branch)

**Interfaces:**
- Consumes: `root.data.name` (already present on every page's data).
- Produces: no new symbols; removes the hardcoded "電吉他學習路徑" string so the renderer is instrument-agnostic.

- [ ] **Step 1: Define expected behavior**

On the guitar page, hovering the root node tooltip must show the root's own name (`電吉他學習`) instead of the hardcoded `電吉他學習路徑`. On the drum page (later) it will show `爵士鼓學習`. This proves the string is data-driven.

- [ ] **Step 2: Edit the depth-0 branch**

In `script.js`, replace:
```js
  if (d.depth === 0) {
    return `<span class="tip-action">電吉他學習路徑</span>`;
  }
```
with:
```js
  if (d.depth === 0) {
    return `<span class="tip-action">${d.data.name}</span>`;
  }
```

- [ ] **Step 3: Verify in browser**

Run `python -m http.server 8000`, open `http://localhost:8000/guitar.html`, hover the orange root node.
Expected: tooltip reads `電吉他學習` (the data's root name). Tree otherwise unchanged.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "refactor: derive root tooltip title from data name"
```

---

### Task 4: Drum data (`data-drum.js`)

**Files:**
- Create: `data-drum.js`

**Interfaces:**
- Produces: global `const data` (drum tree) consumed by `drum.html` (Task 5). Same shape as `data-guitar.js`: `{ name, children?, url? }`.

- [ ] **Step 1: Write the validation check (expect it to fail first)**

Run (Bash) before creating the file — confirms the test catches a missing/short file:
```bash
python - <<'PY'
import re, os
if not os.path.exists('data-drum.js'):
    print('FAIL: data-drum.js missing'); raise SystemExit(0)
src = open('data-drum.js', encoding='utf-8').read()
ids = re.findall(r'watch\?v=([A-Za-z0-9_-]+)"', src)
print('total:', len(ids), 'unique:', len(set(ids)))
PY
```
Expected: `FAIL: data-drum.js missing`.

- [ ] **Step 2: Create `data-drum.js`**

Create `data-drum.js` with exactly this content:

```js
const data = {
  name: "爵士鼓學習",
  children: [
    {
      name: "技術入門",
      children: [
        {
          name: "基礎入門",
          children: [
            { name: "認識套鼓 配置/音色", url: "https://www.youtube.com/watch?v=YbnPlxjFAqg" },
            { name: "爵士鼓介紹+大鼓基礎踩法", url: "https://www.youtube.com/watch?v=joTW8k6iBMI" },
            {
              name: "握棒與運棒",
              children: [
                { name: "握棒與運棒全攻略", url: "https://www.youtube.com/watch?v=V8nbn9ENdqI" },
                { name: "如何握拿鼓棒&基本練習", url: "https://www.youtube.com/watch?v=VvFUW4PNHZ8" },
                { name: "運棒四法+重音練習", url: "https://www.youtube.com/watch?v=pnb9r5N00lY" }
              ]
            },
            { name: "手腳基本功・協調性", url: "https://www.youtube.com/watch?v=zBuyjr6wHEk" },
            { name: "練鼓後手部伸展運動", url: "https://www.youtube.com/watch?v=ciyZh0hZsOE" }
          ]
        },
        {
          name: "基礎樂理與算拍",
          children: [
            { name: "基本樂理與實戰", url: "https://www.youtube.com/watch?v=0UMCJA9a_Bc" },
            { name: "基礎樂理篇 課程介紹", url: "https://www.youtube.com/watch?v=N6aGrcbIDH4" },
            { name: "音符+休止符 & 切分音", url: "https://www.youtube.com/watch?v=d1s7mksGcBk" },
            { name: "數/算拍子", url: "https://www.youtube.com/watch?v=YwyANuQKu5Q" },
            { name: "拍號+節拍器介紹", url: "https://www.youtube.com/watch?v=nOO8j21nQuw" },
            { name: "三連音介紹", url: "https://www.youtube.com/watch?v=YcWk2QblrrY" },
            {
              name: "算拍三循環",
              children: [
                { name: "三循環 pt.1 拍子理解", url: "https://www.youtube.com/watch?v=VZ4vAhi7xtc" },
                { name: "三循環 pt.2 完整三循環", url: "https://www.youtube.com/watch?v=hCW4q5etT6k" },
                { name: "關於算拍 對練習的好處", url: "https://www.youtube.com/watch?v=H4UubEFPwdQ" },
                { name: "如何算歌的速度", url: "https://www.youtube.com/watch?v=jXMhziqWnO8" }
              ]
            }
          ]
        },
        {
          name: "基本技巧",
          children: [
            {
              name: "打點 Rudiments",
              children: [
                { name: "單擊、雙擊與輪鼓", url: "https://www.youtube.com/watch?v=A4kmAm2L2V0" },
                { name: "三連音", url: "https://www.youtube.com/watch?v=eHPhNOufWs4" },
                { name: "輕重音", url: "https://www.youtube.com/watch?v=uD5i9KDzzjw" },
                { name: "Paradiddles 與應用", url: "https://www.youtube.com/watch?v=kuOKNhk1ods" },
                { name: "在家練打點", url: "https://www.youtube.com/watch?v=_kyGhECIEI0" },
                { name: "實用超順手打點", url: "https://www.youtube.com/watch?v=XaX3sGIeQZY" },
                {
                  name: "零鼓打 打點訓練",
                  children: [
                    { name: "基礎節奏練習(16分/切分)", url: "https://www.youtube.com/watch?v=-CoLqmq5v9M" },
                    { name: "輪鼓(輪音)+雙擊", url: "https://www.youtube.com/watch?v=oTrtgt6Jros" },
                    { name: "雙擊(點)練習(2)", url: "https://www.youtube.com/watch?v=lIEHYkKeSs8" },
                    { name: "Paradiddle 單雙擊複合", url: "https://www.youtube.com/watch?v=oeZDxcetSLM" },
                    { name: "非慣用手(左手)強化", url: "https://www.youtube.com/watch?v=OGpi0rtSe_o" },
                    { name: "基礎打點練習(2)", url: "https://www.youtube.com/watch?v=mAi2btBX8FY" },
                    { name: "基礎打點(3)重音", url: "https://www.youtube.com/watch?v=T6LfGhtX-_c" },
                    { name: "三連音的練習", url: "https://www.youtube.com/watch?v=jBhRrnx1hWg" },
                    { name: "六連音的練習", url: "https://www.youtube.com/watch?v=YpWdsOVbudg" },
                    { name: "半拍三連音", url: "https://www.youtube.com/watch?v=7Jh8VbxUDYM" },
                    { name: "重音練習(2)", url: "https://www.youtube.com/watch?v=vCORwry-4VM" },
                    { name: "暖身+速度練習", url: "https://www.youtube.com/watch?v=HIggo_DYCVE" },
                    { name: "六連擊練習(2)", url: "https://www.youtube.com/watch?v=jTlRk7CPM2c" },
                    { name: "2連擊/3連擊打點", url: "https://www.youtube.com/watch?v=-poTSAodYCQ" },
                    { name: "Paradiddle 打點(2)", url: "https://www.youtube.com/watch?v=UBdsOx0HbRU" }
                  ]
                }
              ]
            },
            {
              name: "大鼓腳法",
              children: [
                { name: "大鼓是用「甩」的 Heel Up", url: "https://www.youtube.com/watch?v=ZcgN92XGNIk" },
                { name: "簡單大鼓變化的堆疊", url: "https://www.youtube.com/watch?v=362fBAYO0hY" },
                { name: "關於「大鼓」的練習", url: "https://www.youtube.com/watch?v=gyvxQArW5gw" },
                { name: "關於「大鼓」的練習(2)", url: "https://www.youtube.com/watch?v=vm5CL2AgtNo" }
              ]
            },
            {
              name: "基礎節奏入門",
              children: [
                { name: "五個適合新手的入門節奏", url: "https://www.youtube.com/watch?v=3E6KKcjio-g" },
                { name: "常見節奏 4/8/16 beats", url: "https://www.youtube.com/watch?v=2BazhiIbs0k" },
                { name: "進階節奏", url: "https://www.youtube.com/watch?v=SR80-05gZ0Y" },
                { name: "第一個節奏&樂曲結構", url: "https://www.youtube.com/watch?v=wXRpP63SZMs" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "音樂知識",
      children: [
        {
          name: "節奏型 / 曲風",
          children: [
            { name: "8 Beat 微調秘密", url: "https://www.youtube.com/watch?v=HhK1eJR9Ry4" },
            { name: "靈魂樂 Soul", url: "https://www.youtube.com/watch?v=HvrSfL6QkVE" },
            { name: "妞妞 Twist Rock'n'Roll", url: "https://www.youtube.com/watch?v=m4Djd-90XH0" },
            { name: "迪斯可 Disco", url: "https://www.youtube.com/watch?v=6Q-fY0z-3mA" },
            { name: "放克 Funk (1)", url: "https://www.youtube.com/watch?v=PUFn0Ia-pws" },
            { name: "放克 Funk (2) 拆解", url: "https://www.youtube.com/watch?v=j1diCqtr6w4" },
            { name: "慢搖滾 Slow Rock", url: "https://www.youtube.com/watch?v=a3MWVADMKXE" },
            { name: "摩城 Motown", url: "https://www.youtube.com/watch?v=SRmsuRrL4Mk" },
            { name: "巴薩諾瓦 Bossa Nova", url: "https://www.youtube.com/watch?v=oZH4qKlTYWE" },
            { name: "華爾滋 Waltz", url: "https://www.youtube.com/watch?v=ToVYv50nTtc" },
            { name: "探戈 Tango + Flam", url: "https://www.youtube.com/watch?v=-JV_uAXgmBQ" },
            { name: "倫巴 Rumba", url: "https://www.youtube.com/watch?v=WGBLY9i5nJM" },
            { name: "恰恰 Cha-Cha", url: "https://www.youtube.com/watch?v=z9_cCxMw_ac" }
          ]
        },
        {
          name: "節奏理論 / 律動",
          children: [
            { name: "System & Syncopation", url: "https://www.youtube.com/watch?v=XojgBT--S0g" },
            { name: "鬼音 Ghost Note", url: "https://www.youtube.com/watch?v=0avIv1q8vKY" },
            { name: "高階線性節奏", url: "https://www.youtube.com/watch?v=fOFZFrF57og" },
            { name: "時間扭曲 讓節奏變速", url: "https://www.youtube.com/watch?v=3sGkpdpf-9s" },
            { name: "伸縮「董次大次」", url: "https://www.youtube.com/watch?v=pK_RgKfEtxM" },
            { name: "改變 Ride 位置", url: "https://www.youtube.com/watch?v=RynGuAGnMrU" },
            { name: "Unison 頻率學", url: "https://www.youtube.com/watch?v=P5xp7B1kIjE" },
            { name: "關於「移位」練習", url: "https://www.youtube.com/watch?v=IEzyOO2hTSA" },
            { name: "關於「重音」的練習", url: "https://www.youtube.com/watch?v=kEwlAGSm6XM" }
          ]
        },
        {
          name: "過門 Fill",
          children: [
            { name: "七個新手基本過門", url: "https://www.youtube.com/watch?v=zJ0a5vrA9rY" },
            { name: "兩個新手友善的過門", url: "https://www.youtube.com/watch?v=3s2hmtD2UwQ" },
            { name: "4分與8分組合過門", url: "https://www.youtube.com/watch?v=T5S03HJDw1s" },
            { name: "16分拆點過門", url: "https://www.youtube.com/watch?v=vYA1bHAYlIQ" },
            { name: "積木造句法 神級過門", url: "https://www.youtube.com/watch?v=iuBmf0IQzWI" },
            { name: "Tom 鼓 3 個黃金軌跡", url: "https://www.youtube.com/watch?v=HymPf_6hc3M" },
            { name: "「3+3+3+3+4」公式", url: "https://www.youtube.com/watch?v=Dh87jq5nOas" },
            { name: "50 BPM 照妖鏡", url: "https://www.youtube.com/watch?v=P9Zsyw9_e7Y" },
            { name: "三概念編四種過門", url: "https://www.youtube.com/watch?v=yENBkJAKZ4g" },
            { name: "爵士鼓過門概論", url: "https://www.youtube.com/watch?v=J4wquoDEFiI" },
            { name: "關於「過門」的練習", url: "https://www.youtube.com/watch?v=Dp70gKKDEFo" }
          ]
        },
        {
          name: "讀譜 / 採譜",
          children: [
            { name: "關於「聽寫」鼓譜", url: "https://www.youtube.com/watch?v=_wsy7pjN-6U" },
            { name: "採譜訓練-卡通歌(1)", url: "https://www.youtube.com/watch?v=RfSmf5fZZEs" },
            { name: "採譜訓練-卡通歌(2)", url: "https://www.youtube.com/watch?v=dvH06OZF54k" },
            { name: "鼓譜 [Lemon]", url: "https://www.youtube.com/watch?v=EkNwnzGjMLE" },
            { name: "讀譜/視譜 [Scandal Baby]", url: "https://www.youtube.com/watch?v=ftspGk3Yhfo" },
            { name: "讀譜/視譜 [Lemon]", url: "https://www.youtube.com/watch?v=7Q6PSGW3txE" },
            { name: "讀譜/視譜 [櫻花結局]", url: "https://www.youtube.com/watch?v=y0j_1RzpGpY" }
          ]
        }
      ]
    },
    {
      name: "實踐應用",
      children: [
        {
          name: "練習與速度",
          children: [
            { name: "練不快的 3 個練習思維", url: "https://www.youtube.com/watch?v=EgUC3qhqnUg" },
            { name: "打的快之前的三個觀念", url: "https://www.youtube.com/watch?v=VGn6ZdljrH0" },
            { name: "四種提升速度的練習(上)", url: "https://www.youtube.com/watch?v=kGVC2M5u5YE" },
            { name: "四種提升速度的練習(下)", url: "https://www.youtube.com/watch?v=IxE53cqOOtk" },
            { name: "慢慢練 vs 原速練", url: "https://www.youtube.com/watch?v=MqpnU755fPA" },
            { name: "打快歌 180 BPM 偷懶", url: "https://www.youtube.com/watch?v=R5k8Cxvnek4" },
            { name: "看幾百部還打不好(實驗)", url: "https://www.youtube.com/watch?v=7m-XS_mufgg" },
            { name: "免費YT vs 付費 學習地圖", url: "https://www.youtube.com/watch?v=ZsW6g_NfXqA" },
            { name: "爵士鼓曲子練習三步驟", url: "https://www.youtube.com/watch?v=jZna6Lk13w8" }
          ]
        },
        {
          name: "即興演奏",
          children: [
            { name: "3+1 架構即興實戰", url: "https://www.youtube.com/watch?v=b_XVNIXilzY" },
            { name: "Panam Panic - Gravity 即興", url: "https://www.youtube.com/watch?v=tT_RwGbGyU8" }
          ]
        },
        {
          name: "周邊知識 / 打擊樂器",
          children: [
            { name: "鼓如何調音＆必備小物", url: "https://www.youtube.com/watch?v=mC1zTgjXu38" },
            { name: "幾種鈸的演奏方法", url: "https://www.youtube.com/watch?v=W6ByTWSqnLI" },
            { name: "幾種沙鈴的介紹", url: "https://www.youtube.com/watch?v=L7gFAe2W4CA" },
            { name: "聖誕雪鈴介紹", url: "https://www.youtube.com/watch?v=jBnklhg3WL0" },
            { name: "在 KTV 鈴鼓打法", url: "https://www.youtube.com/watch?v=1WytcJ0ZeLc" },
            { name: "木製打擊樂器介紹", url: "https://www.youtube.com/watch?v=lK454Vwlogw" }
          ]
        },
        {
          name: "演奏與 Cover",
          children: [
            { name: "Makeba", url: "https://www.youtube.com/watch?v=fy8uoJ3n6Sk" },
            { name: "夢醒時分", url: "https://www.youtube.com/watch?v=mcchGnKBSTA" },
            { name: "New Jeans - ETA", url: "https://www.youtube.com/watch?v=oaPebc2DDQM" },
            { name: "NF - Trust 即興", url: "https://www.youtube.com/watch?v=FY2RQDTmUAQ" },
            { name: "Smokepurpp - 6 Rings", url: "https://www.youtube.com/watch?v=qTTxw2iufgE" },
            { name: "pH1 - Cupid", url: "https://www.youtube.com/watch?v=8oBQMRYil4s" },
            { name: "Asiaboy & Lizi - PIMP", url: "https://www.youtube.com/watch?v=r_sGjMN_Yqs" },
            { name: "Shinigami", url: "https://www.youtube.com/watch?v=30wVj3ZY0Ic" },
            { name: "Dark Charybdis (live)", url: "https://www.youtube.com/watch?v=-IMzpVsVYwU" },
            {
              name: "玩月樂 創意演奏",
              children: [
                { name: "但願人長久 (Cup+Glass)", url: "https://www.youtube.com/watch?v=7LyQsdl5MrQ" },
                { name: "Cup song 怎麼玩", url: "https://www.youtube.com/watch?v=br_w6J3qt44" },
                { name: "聖誕組曲 (Piano&Drum)", url: "https://www.youtube.com/watch?v=htGa7CmrMC4" },
                { name: "River Dance 大河之舞", url: "https://www.youtube.com/watch?v=tV_BOKqmpug" },
                { name: "ASMR 海浪聲節奏", url: "https://www.youtube.com/watch?v=WkjfkQS54Ns" },
                { name: "Scandal Baby", url: "https://www.youtube.com/watch?v=cjRleo1xDQU" },
                { name: "沖繩 三線&Cajon", url: "https://www.youtube.com/watch?v=6SPQpHCUSi0" }
              ]
            }
          ]
        },
        {
          name: "鼓手見聞 / 樂器巡禮",
          children: [
            { name: "韓國大邱鼓專賣店", url: "https://www.youtube.com/watch?v=bSTv_kriKK4" },
            { name: "溫哥華 Rufus Drum Shop", url: "https://www.youtube.com/watch?v=M4Wmq2G2dIA" },
            { name: "紐約 Sam Ash", url: "https://www.youtube.com/watch?v=hYfN1nnnNZQ" },
            { name: "樂園樂器商街", url: "https://www.youtube.com/watch?v=mFwCLXfQofg" },
            { name: "專訪韓國鼓手 고니", url: "https://www.youtube.com/watch?v=FFcfYLgjYQc" },
            { name: "音樂旅程分享會", url: "https://www.youtube.com/watch?v=8ALoAeP7R7U" },
            { name: "鼓錄音側拍", url: "https://www.youtube.com/watch?v=VCEsnvvbras" },
            { name: "德國尋音之旅", url: "https://www.youtube.com/watch?v=IxAXuRs0mfo" }
          ]
        }
      ]
    }
  ]
};
```

- [ ] **Step 3: Run the validation check (expect PASS)**

Run (Bash):
```bash
python - <<'PY'
import re
src = open('data-drum.js', encoding='utf-8').read()
ids = re.findall(r'watch\?v=([A-Za-z0-9_-]+)"', src)
bad = [i for i in ids if len(i) != 11]
print('total:', len(ids), 'unique:', len(set(ids)), 'malformed:', bad)
assert len(ids) == 127, f'expected 127 got {len(ids)}'
assert len(set(ids)) == 127, 'duplicate video ids found'
assert not bad, f'malformed ids: {bad}'
print('OK: 127 unique well-formed video ids')
PY
```
Expected: `total: 127 unique: 127 malformed: []` then `OK: 127 unique well-formed video ids`.

- [ ] **Step 4: Commit**

```bash
git add data-drum.js
git commit -m "feat: add drum curriculum data (127 video leaves)"
```

---

### Task 5: Drum page (`drum.html`)

**Files:**
- Create: `drum.html`

**Interfaces:**
- Consumes: `INSTRUMENTS` (Task 1), `data-drum.js` (Task 4, global `data`), `script.js`.
- Produces: `drum.html` declaring `data-instrument="drum"`.

- [ ] **Step 1: Create `drum.html`**

Create `drum.html` (identical structure to `guitar.html`, with drum title/data/instrument):

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>爵士鼓學習路徑</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body data-instrument="drum">

<svg id="tree-svg"></svg>

<div id="tooltip"></div>
<button id="expand-toggle" title="展開或收合全部節點">⊞ 展開全部</button>
<div class="hint-bar">↑ 向上捲動探索更多層次 &nbsp;·&nbsp; 點擊節點展開 / 收起</div>

<script src="instruments.js"></script>
<script src="data-drum.js"></script>
<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the drum tree renders**

Run `python -m http.server 8000`, open `http://localhost:8000/drum.html`.
Expected: a tree with root `爵士鼓學習` anchored near the bottom; leftmost path expanded (技術入門 → 基礎入門 → 認識套鼓...). Hover root → tooltip `爵士鼓學習`. Click branches to expand; click the bottom-right `⊞ 展開全部` to expand everything and confirm leaf nodes appear. Click a leaf (e.g. a 過門 video) → opens YouTube in a new tab.

- [ ] **Step 3: Commit**

```bash
git add drum.html
git commit -m "feat: add drum instrument page"
```

---

### Task 6: `script.js` nav bar + nav styles

**Files:**
- Modify: `script.js` (append nav renderer at end of file)
- Modify: `style.css` (append `.nav-bar` styles)

**Interfaces:**
- Consumes: `INSTRUMENTS` (Task 1), `document.body.dataset.instrument`.
- Produces: a fixed top-left nav DOM (`.nav-bar`) on every instrument page; no exported symbols.

- [ ] **Step 1: Append the nav renderer to `script.js`**

At the very end of `script.js` (after the expand-toggle listener block), append:

```js
// ── Instrument nav bar ───────────────────────────────────────────
(function renderNavBar() {
  const current = document.body.dataset.instrument;
  if (typeof INSTRUMENTS === "undefined" || !current) return;

  const nav = document.createElement("div");
  nav.className = "nav-bar";

  const home = document.createElement("a");
  home.className = "nav-home";
  home.href = "index.html";
  home.textContent = "← 首頁";
  nav.appendChild(home);

  INSTRUMENTS.forEach(inst => {
    const isCurrent = inst.id === current;
    const el = document.createElement(isCurrent ? "span" : "a");
    el.className = "nav-switch" + (isCurrent ? " nav-current" : "");
    if (!isCurrent) el.href = inst.page;
    el.textContent = inst.emoji + " " + inst.label;
    el.title = inst.label;
    nav.appendChild(el);
  });

  document.body.appendChild(nav);
})();
```

- [ ] **Step 2: Append the nav styles to `style.css`**

At the end of `style.css`, append:

```css
/* ── Instrument nav bar ─────────────────────────── */
.nav-bar {
  position: fixed;
  top: 16px; left: 16px;
  z-index: 30;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #334;
  background: rgba(10, 10, 24, 0.88);
  backdrop-filter: blur(8px);
  font-size: 13px;
}
.nav-home { color: #99AAFF; text-decoration: none; padding: 2px 6px; }
.nav-home:hover { color: #C8D4E8; }
.nav-switch { color: #667; text-decoration: none; padding: 2px 6px; border-radius: 5px; }
.nav-switch:hover { color: #C8D4E8; }
.nav-switch.nav-current { color: #FFAA70; background: rgba(255,107,53,0.12); cursor: default; }
```

- [ ] **Step 3: Verify the nav on both pages**

Run `python -m http.server 8000`.
- Open `http://localhost:8000/guitar.html`: top-left nav shows `← 首頁  🎸 電吉他  🥁 鼓`; `🎸 電吉他` is highlighted (orange) and not a link; `🥁 鼓` is a link.
- Click `🥁 鼓` → lands on the drum tree; now `🥁 鼓` is highlighted and `🎸 電吉他` is a link.
- (`← 首頁` will 404 until Task 7 — that is expected at this point.)

- [ ] **Step 4: Commit**

```bash
git add script.js style.css
git commit -m "feat: render instrument nav bar on tree pages"
```

---

### Task 7: Landing page (`index.html` + `landing.js`) + card styles

**Files:**
- Create: `index.html`
- Create: `landing.js`
- Modify: `style.css` (append `.landing` / `.card` styles)

**Interfaces:**
- Consumes: `INSTRUMENTS` (Task 1).
- Produces: `index.html` (GitHub Pages entry) rendering one card per instrument.

- [ ] **Step 1: Create `landing.js`**

```js
// Render instrument cards on the landing page from the shared registry.
(function renderLanding() {
  const root = document.getElementById("landing");
  if (!root || typeof INSTRUMENTS === "undefined") return;
  INSTRUMENTS.forEach(inst => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = inst.page;
    card.innerHTML =
      `<div class="card-emoji">${inst.emoji}</div>` +
      `<div class="card-label">${inst.label}</div>`;
    root.appendChild(card);
  });
})();
```

- [ ] **Step 2: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>樂器學習路徑</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="landing-page">
  <h1 class="landing-title">樂器學習路徑</h1>
  <div id="landing" class="landing"></div>
  <script src="instruments.js"></script>
  <script src="landing.js"></script>
</body>
</html>
```

- [ ] **Step 3: Append landing styles to `style.css`**

```css
/* ── Landing page ───────────────────────────────── */
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 36px;
}
.landing-title {
  color: #FFAA70;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.landing {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  gap: 12px;
  border-radius: 14px;
  border: 1px solid #334;
  background: rgba(10, 10, 24, 0.88);
  text-decoration: none;
  color: #C8D4E8;
  transition: background 0.18s, border-color 0.18s, transform 0.18s;
}
.card:hover {
  background: rgba(30, 30, 60, 0.95);
  border-color: #6677EE;
  transform: translateY(-3px);
}
.card-emoji { font-size: 48px; line-height: 1; }
.card-label { font-size: 16px; }
```

- [ ] **Step 4: Verify the landing + full round trip**

Run `python -m http.server 8000`, open `http://localhost:8000/` (i.e. `index.html`).
Expected: dark page, title `樂器學習路徑`, two centered cards `🎸 電吉他` and `🥁 鼓`. Click `🎸` → guitar tree; nav `← 首頁` returns to landing. Click `🥁` → drum tree; `← 首頁` returns. Hover effects on cards work.

- [ ] **Step 5: Commit**

```bash
git add index.html landing.js style.css
git commit -m "feat: add instrument card landing page"
```

---

### Task 8: Update `CLAUDE.md` + final verification

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: nothing. Documentation only.

- [ ] **Step 1: Update the "Running / previewing" and "File roles" sections**

In `CLAUDE.md`, replace the `## File roles` section body so it reflects the multi-page layout. Replace the existing four bullets (index.html / data.js / script.js / style.css) with:

```markdown
- `index.html` — landing page. Loads `instruments.js` + `landing.js` to render
  one card per instrument. GitHub Pages entry point. No D3, no tree here.
- `instruments.js` — `const INSTRUMENTS` registry (`{id,label,emoji,page}`).
  Single source of truth for both the landing cards and each tree page's nav
  bar. Add an instrument here + a `data-<id>.js` + an `<id>.html` to extend.
- `guitar.html` / `drum.html` — per-instrument tree pages. Each sets
  `<body data-instrument="<id>">` and loads, in order, D3 (CDN) →
  `instruments.js` → `data-<id>.js` → `script.js`.
- `data-guitar.js` / `data-drum.js` — curriculum data as one global `const data`
  (`{ name, children?, url? }`). Edit these to change curriculum content.
- `landing.js` — builds the landing cards from `INSTRUMENTS`.
- `script.js` — shared tree renderer + interaction (D3 v7). Reads the root
  title from `data.name` and renders the nav bar from `INSTRUMENTS` +
  `document.body.dataset.instrument`. Tree algorithm is instrument-agnostic.
- `style.css` — dark theme: tree nodes/links/tooltip, `.nav-bar`, landing
  `.card`s. Node appearance is class-driven (see node-type model below).
```

- [ ] **Step 2: Verify the doc references match reality**

Run (Bash):
```bash
for f in index.html guitar.html drum.html instruments.js landing.js data-guitar.js data-drum.js script.js style.css; do test -f "$f" && echo "ok $f" || echo "MISSING $f"; done
```
Expected: `ok` for all nine files.

- [ ] **Step 3: Full manual smoke test**

Run `python -m http.server 8000` and confirm, in order:
1. `/` → landing with two cards.
2. `🎸` card → guitar tree renders, nav present, leaf opens YouTube.
3. `🥁` card → drum tree renders; `⊞ 展開全部` expands all 127 leaves without error.
4. Nav `← 首頁` and instrument switch work from both tree pages.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for multi-instrument architecture"
```

---

## Self-Review

**Spec coverage:**
- Routing / separate HTML pages → Tasks 2, 5, 7. ✓
- `instruments.js` registry + `data-instrument` → Tasks 1, 2, 5, 6. ✓
- `script.js` refactor (dynamic title + nav) → Tasks 3, 6. ✓
- Landing (three-card style; two cards this round) → Task 7. ✓
- Drum tree, 127 leaves, both channels merged by topic → Task 4 (content matches spec §鼓課程樹內容; validated to 127 unique ids). ✓
- Bass deferred, registry-ready → registry comment in Task 1; no bass page built. ✓
- `style.css` additions (nav + cards) → Tasks 6, 7. ✓
- CLAUDE.md update → Task 8. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full content; data file embedded verbatim.

**Type/name consistency:** `INSTRUMENTS` item shape `{id,label,emoji,page}` used identically in `landing.js`, nav renderer, and registry. `document.body.dataset.instrument` matches `<body data-instrument="...">`. `data` global matches each page's `data-<id>.js`. Load order consistent across `guitar.html`/`drum.html`.
