const data = {
  name: "電吉他學習",
  children: [
    {
      name: "技術入門",
      children: [
        {
          name: "基礎入門",
          children: [
            {
              name: "認識吉他結構",
              children: [
                { name: "琴頭・琴頸・琴身" },
                { name: "拾音器 單線圈 / 雙線圈" },
                { name: "搖座 Tremolo / Fixed Bridge", url: "https://www.youtube.com/watch?v=aBayR7n-Vow" },
                { name: "旋鈕 音量 / 音色控制" }
              ]
            },
            {
              name: "持琴與姿勢",
              children: [
                { name: "坐姿練習" },
                { name: "站姿與背帶調整" },
                { name: "手腕放鬆不緊繃" }
              ]
            },
            {
              name: "調音",
              children: [
                { name: "標準調音 E A D G B e" },
                { name: "夾式調音器使用" },
                { name: "相對音感調音（泛音法）" }
              ]
            },
            {
              name: "基礎樂理",
              children: [
                { name: "音名與音程概念" },
                { name: "拍號・節拍・節奏" },
                { name: "吉他 TAB 譜閱讀" },
                { name: "五線譜基礎（可選）" }
              ]
            }
          ]
        },
        {
          name: "基本技巧",
          children: [
            {
              name: "左手技巧",
              children: [
                { name: "按弦・換弦練習", url: "https://www.youtube.com/watch?v=PyYBhOSj-cw" },
                {
                  name: "和弦",
                  children: [
                    { name: "開放和弦 Em Am G C D", url: "https://www.youtube.com/watch?v=LnWPZWJMa00" },
                    { name: "封閉和弦 Bar Chord F / Bm", url: "https://www.youtube.com/watch?v=Rn_BY3jp2mQ" },
                    { name: "Power Chord (5 和弦)", url: "https://www.youtube.com/watch?v=DZqKY3LjF04" }
                  ]
                },
                { name: "推弦 Bending", url: "https://www.youtube.com/watch?v=1LGYbxBGlhI" },
                { name: "滑弦 Slide / Glissando", url: "https://www.youtube.com/watch?v=KHrCtYmqYm0" },
                { name: "捶弦 Hammer-on", url: "https://www.youtube.com/watch?v=hKkqfxoPA0g" },
                { name: "勾弦 Pull-off", url: "https://www.youtube.com/watch?v=hKkqfxoPA0g" },
                { name: "顫音 Vibrato", url: "https://www.youtube.com/watch?v=4bZtGuQgFhQ" },
                { name: "點弦 Tapping（進階）", url: "https://en.wikipedia.org/wiki/Guitar_technique" }
              ]
            },
            {
              name: "右手技巧",
              children: [
                { name: "撥片握法與角度", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
                { name: "交替撥弦 Alternate Picking", url: "https://en.wikipedia.org/wiki/Guitar_technique" },
                { name: "掃弦 Strumming 節奏型", url: "https://www.youtube.com/watch?v=66ams0oEIro" },
                {
                  name: "悶音 Muting",
                  children: [
                    { name: "掌側悶音 Palm Mute", url: "https://www.youtube.com/watch?v=2fsRgNfGNNo" },
                    { name: "左手悶音" }
                  ]
                },
                { name: "指彈 Fingerpicking", url: "https://www.youtube.com/watch?v=ZcxgfJaQObc" },
                { name: "掃弦技 Sweep Picking（進階）", url: "https://www.youtube.com/watch?v=NS4ydbJWHps" }
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
          name: "音樂理論",
          children: [
            {
              name: "音階",
              children: [
                { name: "五聲音階 Pentatonic（入門必學）", url: "https://www.youtube.com/watch?v=9BszcA6RRGU" },
                { name: "自然大調 Major Scale", url: "https://www.youtube.com/watch?v=_b80dxL2cEs" },
                { name: "自然小調 Natural Minor" },
                { name: "藍調音階 Blues Scale", url: "https://www.youtube.com/watch?v=tBsqsXwzoLU" },
                {
                  name: "調式音階 Modes",
                  children: [
                    { name: "Ionian（= 大調）" },
                    { name: "Dorian（小調風格）" },
                    { name: "Phrygian（西班牙感）" },
                    { name: "Mixolydian（搖滾/藍調）" }
                  ]
                }
              ]
            },
            {
              name: "和弦理論",
              children: [
                { name: "三和弦 Triad" },
                { name: "七和弦 7th Chord" },
                { name: "延伸和弦 9th / 11th / 13th" },
                { name: "常見進行 I-IV-V / I-V-vi-IV", url: "https://www.youtube.com/watch?v=NDIxitdkzVI" }
              ]
            },
            {
              name: "節奏感訓練",
              children: [
                { name: "節拍器練習法（從慢練起）", url: "https://www.youtube.com/watch?v=T3J5PmNws7g" },
                { name: "切分音 Syncopation", url: "https://www.youtube.com/watch?v=CFz1959htgM" },
                { name: "Groove 與律動感", url: "https://www.youtube.com/watch?v=HVYn2J67e5s" }
              ]
            }
          ]
        },
        {
          name: "音樂風格",
          children: [
            {
              name: "藍調 Blues",
              children: [
                { name: "12 小節藍調進行", url: "https://www.youtube.com/watch?v=1e0VCu4yb74" },
                { name: "推弦・顫音表情", url: "https://www.youtube.com/watch?v=8AJZiu3WyMs" },
                { name: "BB King / SRV / Clapton", url: "https://www.youtube.com/watch?v=d1_UANIJ4Rc" }
              ]
            },
            {
              name: "搖滾 Rock",
              children: [
                { name: "Riff 構成與 Power Chord", url: "https://www.youtube.com/watch?v=YJg3h325iyY" },
                { name: "破音・過載音色使用", url: "https://www.youtube.com/watch?v=XSgQN8W-fzo" },
                { name: "AC/DC / Led Zeppelin / Nirvana", url: "https://www.youtube.com/watch?v=y4mu3QMeQsA" }
              ]
            },
            {
              name: "金屬 Metal",
              children: [
                { name: "快速交替撥弦 Speed Picking", url: "https://www.youtube.com/watch?v=-pIoCNhIvkQ" },
                { name: "掃弦技 Sweep Picking", url: "https://www.youtube.com/watch?v=NS4ydbJWHps" },
                { name: "Palm Mute 重擊節奏", url: "https://www.youtube.com/watch?v=2fsRgNfGNNo" },
                { name: "Metallica / Megadeth / Slayer" }
              ]
            },
            {
              name: "流行 Pop",
              children: [
                { name: "常見節奏型 下上下上…", url: "https://www.youtube.com/watch?v=66ams0oEIro" },
                { name: "和弦伴奏與刷弦" },
                { name: "華語流行彈唱歌曲" }
              ]
            },
            {
              name: "爵士 Jazz",
              children: [
                { name: "爵士和弦 maj7 / dom7 / m7b5" },
                { name: "走路 Comping 概念" },
                { name: "ii-V-I 進行即興" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "實踐應用",
      children: [
        {
          name: "設備知識",
          children: [
            {
              name: "電吉他類型",
              children: [
                { name: "Stratocaster 系（通用）" },
                { name: "Les Paul 系（厚實音色）" },
                { name: "Telecaster 系（Country/Rock）" },
                { name: "Super Strat / 金屬款（高速）" }
              ]
            },
            {
              name: "音箱 Amplifier",
              children: [
                { name: "真空管音箱 Tube Amp", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" },
                { name: "電晶體音箱 Solid State", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" },
                { name: "數位模擬 Kemper / HX Stomp", url: "https://en.wikipedia.org/wiki/Guitar_amplifier" }
              ]
            },
            {
              name: "效果器",
              children: [
                { name: "過載/破音 Overdrive / Dist" },
                { name: "延遲 Delay" },
                { name: "殘響 Reverb" },
                { name: "合唱/調變 Chorus / Flanger" },
                { name: "Wah 踏板" },
                { name: "訊號鏈排列概念" }
              ]
            }
          ]
        },
        {
          name: "實戰進階",
          children: [
            {
              name: "每日練習計畫",
              children: [
                { name: "熱身 5 min 音階上下行" },
                { name: "技術練習 15 min" },
                { name: "曲目練習 20 min" },
                { name: "即興/創作 10 min" }
              ]
            },
            {
              name: "即興演奏",
              children: [
                { name: "Backing Track 練習" },
                { name: "Call & Response 概念" },
                { name: "Jam Session 與樂手互動" }
              ]
            },
            {
              name: "錄音與創作",
              children: [
                { name: "DAW 基礎 GarageBand / Reaper" },
                { name: "DI 錄音 + 軟體音箱模擬" },
                { name: "寫自己的 Riff / 歌曲" }
              ]
            },
            { name: "合奏與舞台表演" }
          ]
        }
      ]
    }
  ]
};
