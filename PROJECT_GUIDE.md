# ◊ CodeSage System Documentation

This guide maps the platform's architectural components for rapid maintenance and visual scaling. This file is intended for internal developer use.

---

## 🏗 Component Map

### 1. The Gateway (`src/App.jsx`)
- **Role:** Central router and state orchestra.
- **Key States:** `user` (auth session), `location.pathname` (routing).
- **Views:** Landing, About, Dashboard/Engine.

### 2. The Landing Zone (`src/components/Hero.jsx`)
- **Aesthetic:** "Crimson & Carbon" minimalist design.
- **Elements:** Pulsing Diamond logo, high-impact "Deep Logic Review" typography.

### 3. The Forge (`src/components/CodeIntegrityEngine.jsx`)
- **Role:** Main developer workspace.
- **Layout:** Full-width code editor with a **Horizontal Live Intelligence Bar** below.
- **Panels:**
  - **Terminal (Dashboard):** Real-time code entry and re-analysis capabilities.
  - **Intelligence (Analytics):** Side-by-side comparison of "Legacy" vs "Refactored" code.
  - **Complexity Analysis:** Tracks Time and Space complexity improvements ($O(n)$ optimization tracking).

### 4. Mission Transparency (`src/components/About.jsx`)
- **Role:** Informational page explaining CodeSage's AI methodology.
- **Aesthetic:** Glassmorphism cards with structured neural-scanning steps.

---

## 🎨 Design System (`src/styles/`)

| Token | Value | Description |
| :--- | :--- | :--- |
| **Crimson** | `#ff4d4d` | Primary brand action color. |
| **Carbon** | `#05070a` | Base background depth. |
| **Typography** | `'Outfit', sans-serif` | Brand font (900 weight for headers). |
| **Glow** | `0 0 15px rgba(255, 77, 77, 0.4)` | Used for interactive elements. |

---

## ⚙️ AI Engine Configuration (`reviewService.js`)

- **Model:** Google Gemini Pro.
- **Prompt Logic:** Uses a strictly defined JSON schema to ensure the AI returns structured analysis including:
  - `oldTimeComplexity` / `newTimeComplexity`
  - `oldSpaceComplexity` / `newSpaceComplexity`
  - `improvedCode` (Refactored logic)

---

## 🛠 Database & Security

### Supabase Table: `reviews`
- `user_id`: Links reviews to specific authenticated users.
- `code`: The original source code provided.
- `result`: JSONB blob containing the complete Gemini analysis.

### Security Best Practices
- **NEVER** commit the `.env` file to version control.
- **NEVER** expose the `GEMINI_API_KEY` in client-side code (always route through `server.js`).
- Use RLS (Row Level Security) policies in Supabase to protect user data.

---

## ⚡ Maintenance Commands

- **Local Build:** `npm run build`
- **AI Gateway Server:** `npm run server` (Must be running for analysis to work).
- **Dev Environment:** `npm run dev`.
- **Linting:** `npm run lint`.

---

> [!IMPORTANT]
> This file is excluded from git via `.gitignore` to keep internal structural notes private from public forks.
