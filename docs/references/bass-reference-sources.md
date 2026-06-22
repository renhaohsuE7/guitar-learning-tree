# 貝斯(Bass)技能樹 — 參考來源蒐集

> **狀態**:貝斯頁面本次**延後**(見 `docs/superpowers/specs/2026-06-22-multi-instrument-routing-and-drum-tree-design.md`)。
> 本文先把使用者指定的貝斯 YouTube 來源蒐集存檔,供日後建立 `data-bass.js` 技能樹使用。
> 主來源為 **goomobs**(中文貝斯教學頻道,風格輕鬆、強調新手友善)。

- **日期存取**:2026-06-22
- **抽取方式**:`uvx yt-dlp --flat-playlist --print-to-file "%(playlist_index)s | %(id)s | %(title)s" <file> <url>`(UTF-8,避免 Windows 主控台 Big5 亂碼)
- **leaf URL 格式(日後建樹用)**:`https://www.youtube.com/watch?v=<id>`

## 來源一覽

| 代號 | 名稱 | URL | 數量 |
| --- | --- | --- | --- |
| PL1 | 貝斯好簡單!新手快來看 | https://www.youtube.com/playlist?list=PLMD-lgpLTtZi1YCet3L0iBUmEJUZqg1NU | 15 |
| PL2 | SLAP彈起來系列 | https://www.youtube.com/playlist?list=PLMD-lgpLTtZidBzhoJIQ04BJW3pfAbHk5 | 7 |
| PL3 | 左右手必備技術系列 | https://www.youtube.com/playlist?list=PLMD-lgpLTtZiIqNB1785pPBPO1NWzmlX3 | 7 |
| CH | goomobs 頻道(全部影片) | https://www.youtube.com/@goomobs | 49 |

> 三個 playlist 皆為 CH 頻道內容的策展子集(影片 ID 與頻道清單重疊)。建樹時以 **CH 頻道清單**為母體,playlist 作為「主題序列」參考。

## 建議分類(供日後建樹;沿用三大支幹)

- **技術入門 / 基礎入門**:新手物品清單 `GyCL9NTcT1s`、右手篇 `sv7mSLQ5qBM`、左手篇 `FxU72Zm2ip4`、長短音 `V5DfhCXaJAk`、八度音 `AQEIaKKRdr0`、指板背起來 `JlazS4sVybY`、簡易記譜法 `znb-997gMoE`、練聽力 `JqDxsqZG4YM`
- **技術入門 / 基本技巧**:
  - Slap:基本動作 `0faaY8-d3WE`、打鐵健身操 `xR5YpFyrlMU`、打鐵健身操2(悶音) `n4cWJwsDWjs`、敲敲練習曲 `l_UgMWntxSg`
  - 滑音/音色:滑音 `duRanaFBMwo`、音色 TONE `ShdGQEGtDMs`
- **音樂知識 / 樂理・和弦**:音程+三和弦+大調順階 `qwdfWmj1hm0`、順階和弦怎麼用 `Lr6k0vfV_Qc`、和弦下集 `RSUmFrbvwxE`、順階應用(琉球愛歌) `iVUfZh740eU`、社課音程順階 `7xf9og8opzw`、音程與指型(I Feel Good) `x4aGnF02mic`、五度音/Bossa nova 經過音 `IqXj8cqeOAw`
- **音樂知識 / 節奏與伴奏**:基礎節奏 8分16分 `mRblft8MbR4`、基本伴奏變化(不只根音) `PeHuK4X0BqI`
- **實踐應用 / 練習與即興**:即興新手第一步 `ShQQCvrWwbc`、陪你練琴#1 `PCfNKn9gcuY`、#2 `GkArUmqLms0`、#3 `0IAaTwdIjaw`、初學彈歌(踊り子) `JyXPIxLPS4o`、跳級滑音快歌 `I7JxhQK-TB0`
- **實踐應用 / 器材**:Fretless 開箱 `z8zD-oPAbwI`、遠距學貝斯準備+麥克風 `G47W_NPr0F8`、六個音樂 APP `1ymfoRG_tKY`
- **實踐應用 / 演奏 Cover**:Muse-Hysteria `XrBC1b24O3k`、hiatus kaiyote-red room `zr2MS3ALjSk`、vulfpeck-simple step `CSk_-RTu6Pc`、level 42-Almost there `94qJC2bREe0`、失眠電影院 `VrtJHZKBt1Q`、Coffee shop cover `Le1DGVEw3gQ`
- **見聞 / Jam・旅行 Vlog(可選分支)**:東京 Jam `dozcoR2G-Tk`、尚美音樂學校 `kizlYhwIoXU`、清邁 jam `MkV_7Ck1Rtc`、沖繩 `9gPEZq9XM-k`、東京吸貝斯二日遊 `OOuN80FfUAA`、首爾(上) `kkz-Jh6tKJI`、首爾(下) `1CLwZ9q84FM`、浪人祭 `iQje6WxRNTY`、蘆洲 Clash `V61z9IrN4ik`、花蓮花聲客廳 `Q4yXtxh0HHI`、披薩店 Crafthouse `qdKfEw_30f0`、閒聊 podcast `HhDQb6u9ZS8`

## PL1「貝斯好簡單!新手快來看」(index | id | title)

```
01 | JlazS4sVybY | 熟悉指板第一步！一刀兩斷切三塊！祝你指板背起來
02 | GyCL9NTcT1s | 新手貝斯物品清單，你都準備好了嗎？
03 | sv7mSLQ5qBM | 真正的初學第一堂課！左右手健身房之右手篇
04 | FxU72Zm2ip4 | 真正的初學者第二堂課！左右手健身房之左手篇
05 | znb-997gMoE | 只會看TAB譜也能學會記譜？初學者超級簡易的記譜法
06 | JqDxsqZG4YM | 初學練聽力第一步！靠自己的耳朵成為聽力戰士
07 | AQEIaKKRdr0 | 成為巨肌左手王！八度音來啦！Slap/finger 都重要的技巧
08 | ShdGQEGtDMs | 貝斯的音色要怎麼掌握？TONE 在手上篇
09 | 0IAaTwdIjaw | 陪你練琴的好朋友第3回（james brown-get up offa that thing）
10 | duRanaFBMwo | 讓句子變好聽！滑音加起來
11 | xR5YpFyrlMU | slap打鐵健身操！超基礎新手10分鐘練習！長短音的運用
12 | n4cWJwsDWjs | slap打鐵健身操第二回！加上悶音
13 | qwdfWmj1hm0 | 音程！三和弦！大調順階和弦！（重製版）
14 | JyXPIxLPS4o | 初學系列-學完指板與大調音階想彈歌！踊り子 Vaundy
15 | I7JxhQK-TB0 | 初學系列-同樣幾個音也能彈得更好聽（稍微跳級）
```

## PL2「SLAP彈起來系列」(index | id | title)

```
1 | l_UgMWntxSg | 陪你練琴訂閱版-敲敲練習曲！Slap 敲起來！Look Before You Leap
2 | n4cWJwsDWjs | slap打鐵健身操第二回！加上悶音
3 | xR5YpFyrlMU | slap打鐵健身操！超基礎新手10分鐘練習！長短音的運用
4 | GkArUmqLms0 | 陪你練琴的好朋友！第2回（一點slap的句子）
5 | PCfNKn9gcuY | 陪你練琴的好朋友！第1回
6 | AQEIaKKRdr0 | 成為巨肌左手王！八度音來啦
7 | 0faaY8-d3WE | slap基本動作教學！用拇指震動你的弦
```

## PL3「左右手必備技術系列」(index | id | title)

```
1 | duRanaFBMwo | 讓句子變好聽！滑音加起來
2 | ShdGQEGtDMs | 貝斯的音色要怎麼掌握？TONE 在手上篇
3 | AQEIaKKRdr0 | 成為巨肌左手王！八度音來啦
4 | 0faaY8-d3WE | slap基本動作教學！用拇指震動你的弦
5 | FxU72Zm2ip4 | 真正的初學者第二堂課！左手篇
6 | sv7mSLQ5qBM | 真正的初學第一堂課！右手篇
7 | V5DfhCXaJAk | 八分音符小變化？左手訓練之長短音
```

## CH goomobs 頻道(全部影片;index | id | title)

```
01 | dozcoR2G-Tk | 日本開果醬閒聊！東京Jam session小分享
02 | kizlYhwIoXU | 尚美音樂學校 參觀日體驗心得
03 | I7JxhQK-TB0 | 初學系列-同樣幾個音也能彈更好聽（稍微跳級）
04 | JyXPIxLPS4o | 初學系列-學完指板大調音階想彈歌！踊り子 Vaundy
05 | XrBC1b24O3k | Muse-Hysteria bass cover
06 | zr2MS3ALjSk | 貝斯是主角！hiatus kaiyote-red room
07 | MkV_7Ck1Rtc | 前進清邁jam起來！音樂之城
08 | qwdfWmj1hm0 | 音程！三和弦！大調順階和弦！（重製版）
09 | PeHuK4X0BqI | 基本伴奏也能做變化！不只有根音
10 | 9gPEZq9XM-k | Okinawa!!! music city! no bass no awamori no life
11 | HhDQb6u9ZS8 | 早安你好你手上有什麼琴？閒聊/podcast
12 | n4cWJwsDWjs | slap打鐵健身操第二回！加上悶音
13 | xR5YpFyrlMU | slap打鐵健身操！長短音的運用
14 | duRanaFBMwo | 讓句子變好聽！滑音加起來
15 | 0IAaTwdIjaw | 陪你練琴的好朋友第3回（james brown）
16 | ShdGQEGtDMs | 貝斯的音色要怎麼掌握？TONE 在手上篇
17 | Le1DGVEw3gQ | Coffee shop cover（配合陪你練琴第2回）
18 | GkArUmqLms0 | 陪你練琴的好朋友！第2回（一點slap句子）
19 | PCfNKn9gcuY | 陪你練琴的好朋友！第1回
20 | z8zD-oPAbwI | Fretless 體驗價不用兩千元！無琴格開箱
21 | 94qJC2bREe0 | Almost there - level 42
22 | AQEIaKKRdr0 | 成為巨肌左手王！八度音
23 | OOuN80FfUAA | 東京吸貝斯二日遊小指南
24 | 0faaY8-d3WE | slap基本動作教學！用拇指震動你的弦
25 | JqDxsqZG4YM | 初學練聽力第一步！成為聽力戰士
26 | 1CLwZ9q84FM | 前進首爾JAM起來（下）首爾最大樂器大樓
27 | iQje6WxRNTY | 2023浪人祭演出一日遊（隨手拍廢片）
28 | znb-997gMoE | 初學者超級簡易的記譜法
29 | CSk_-RTu6Pc | vulfpeck - simple step (bass cover)
30 | V61z9IrN4ik | 蘆洲 Clash New Taipei 聽音樂彈琴
31 | FxU72Zm2ip4 | 真正的初學者第二堂課！左手篇
32 | sv7mSLQ5qBM | 真正的初學第一堂課！右手篇
33 | kkz-Jh6tKJI | 前進首爾JAM起來（上）首爾音樂環境小記錄
34 | G47W_NPr0F8 | 遠距線上學貝斯要準備什麼？順便測 mackie chromium 麥克風
35 | 1ymfoRG_tKY | 分享六個好用的音樂APP！寫譜看譜練琴
36 | Q4yXtxh0HHI | 出來玩系列-花蓮 花聲客廳
37 | GyCL9NTcT1s | 新手貝斯物品清單，你都準備好了嗎？
38 | iVUfZh740eU | 順階和弦應用篇-琉球愛歌！來彈和弦
39 | Lr6k0vfV_Qc | 順階和弦怎麼用？新手抓和弦第一步
40 | ShQQCvrWwbc | 貝斯手開果醬！即興新手第一步！行前說明書
41 | qdKfEw_30f0 | 出來彈系列-披薩店 Crafthouse
42 | x4aGnF02mic | 音程和指型的曖昧關係！I Feel Good - James Brown
43 | V5DfhCXaJAk | 八分音符小變化？左手訓練之長短音
44 | JlazS4sVybY | 熟悉指板第一步！祝你指板背起來
45 | IqXj8cqeOAw | 離開根音舒適圈！五度音之 Bossa nova 基本節奏及經過音
46 | VrtJHZKBt1Q | 歌曲推薦-失眠電影院 (bass cover)
47 | mRblft8MbR4 | 豆芽菜襲來！基礎節奏篇-8分及16分音符
48 | RSUmFrbvwxE | 貝斯怎麼彈和弦？大調順階和弦下集
49 | 7xf9og8opzw | 簡陋的貝斯教學-社課音程與順階和弦
```
