# OpenSpec — GitHub 專案概覽

- **來源 URL**：https://github.com/Fission-AI/OpenSpec
- **抓取日期**：2026-06-15

## 摘要

OpenSpec 是一個 **Spec-Driven Development (SDD)** 框架，幫助 AI coding assistant 與開發者在寫程式前先對齊需求。

### 類型與安裝
- **類型**：CLI 工具 + npm 套件
- **Runtime**：TypeScript / Node.js 20.19.0+
- **全域安裝**：`npm install -g @fission-ai/openspec@latest`
- **初始化**：`openspec init`

### 核心功能
- 支援 25+ AI coding assistant，透過 slash command（如 `/opsx:propose`）驅動
- 自動產生並管理 spec artifacts（proposals、specifications、design docs、implementation tasks）
- 支援 npm / pnpm / yarn / bun
- 內建 telemetry（可 opt-out）

### 設計哲學
- Fluid not rigid（彈性不僵化）
- Iterative not waterfall（迭代不瀑布式）

### License
MIT
