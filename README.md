# ◊ CodeSage | Crimson & Carbon

![Favicon](https://raw.githubusercontent.com/pankajkashp/CodeReview/main/public/favicon.svg)

> **Enterprise-grade code integrity engine for developers who value perfection.**

CodeSage is a high-performance, AI-driven architectural review platform designed to scan, refactor, and master your source code in seconds. Built with a high-contrast cinematic aesthetic, it provides deep intelligence on code structure, security, and optimization.

---

## 🛠 Features

- **🔴 Red Alert Analytics**: High-impact visual feedback on code metrics and health scores.
- **⚡ AI Refactoring**: One-click code optimization powered by Google Gemini 1.5 Flash.
- **📂 Multi-Input Core**: Support for local file imports, manual entry, and real-time history tracking.
- **📄 Export Suite**: Professional PDF reporting for architectural audits.
- **🔐 Secure Console**: Modal-based authentication with Supabase for personalized session history.

## 🎨 Aesthetic: Crimson & Carbon

The platform follows a strict **Red and Black** design language:
- **Primary Color:** `#ff4d4d` (Crimson Red)
- **Background:** `#05070a` (Carbon Black)
- **Typography:** Inter & Monospace for a technical, industrial feel.
- **FX:** Glassmorphism, pulse animations, and dual-row infinite scrolling marquees.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pankajkashp/CodeReview.git
   cd CodeReview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Launch the API server:**
   ```bash
   npm run server
   ```

5. **Launch Dev Server:**
   ```bash
   npm run dev
   ```

## 🗺 Project Structure

```text
src/
├── components/
│   ├── CodeIntegrityEngine.jsx  # Main workspace
│   ├── Analytics.jsx            # Result visualization
│   ├── AuthModal.jsx            # Styled login/signup
│   └── Hero.jsx                 # Landing experience
├── styles/
│   ├── global.css               # Core theme variables
│   └── analytics.css            # Red-highlighted UI components
└── supabaseclient.js            # Infrastructure bridge
```

---

## 🛡 Disclaimer
*CodeSage is an engineering tool. While AI provides high-quality suggestions, always verify mission-critical logic in production environments.*

Built with ❤️ by the **CodeSage Team**.
