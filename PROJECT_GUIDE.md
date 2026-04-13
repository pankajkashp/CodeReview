# ◊ CodeSage System Documentation

This guide maps the platform's architectural components for rapid maintenance and visual scaling.

## 🏗 Component Map

### 1. The Gateway (`src/App.jsx`)
- **Role:** Central router and state orchestra.
- **Key States:** `activeView` (landing vs engine), `user` (auth session), `showAuth` (modal toggle).
- **Sub-components:** `Preloader`, `TopNavigation`, `Hero`, `CodeIntegrityEngine`, `AuthModal`.

### 2. The Landing Zone (`src/components/Hero.jsx`)
- **Aesthetic:** "Bloody Red" gradients and infinite scrolling marquees.
- **Elements:**
  - **Center Logo:** Pulsing Diamond (◇) with concentric rings.
  - **Banner:** Testimonial-styled language cards featuring famous quotes.
  - **Actions:** High-impact "LAUNCH SYSTEM" trigger.

### 3. The Forge (`src/components/CodeIntegrityEngine.jsx`)
- **Role:** Main developer workspace.
- **Panels:**
  - **Terminal (Dashboard):** Real-time code entry and file imports.
  - **Intelligence (Analytics):** Interactive stats, AI refactoring, and PDF export.
  - **History:** Searchable audit trail of previous reviews with delete capability.

### 4. Identity Terminal (`src/components/Profile.jsx`)
- **Features:** 
  - Update Display Name.
  - Custom Avatar Integration (URL-based portraits).
  - Security Logs (History view within profile).

### 5. Access Console (`src/components/AuthModal.jsx`)
- **Logic:** Modal-based login/signup with custom error handling ("Password not correct" detection).
- **Styling:** `src/styles/auth.css` (Glassmorphic Red theme).

---

## 🎨 Theme Tokens (`src/styles/global.css`)

| Utility | Token/Value |
| :--- | :--- |
| **Primary Brand** | `#ff4d4d` (Crimson) |
| **Background** | `#05070a` (Carbon) |
| **Accent Text** | `#ffb7b7` (Light Red) |
| **Border Glow** | `rgba(255, 77, 77, 0.4)` |

---

## 🛠 Database Schema (Supabase)

- **Table:** `analysis_history`
  - `id` (UUID, primary key)
  - `user_id` (FK to auth.users)
  - `code` (text)
  - `result` (jsonb - stores scores, summary, refactors)
  - `created_at` (timestamptz)

---

## ⚡ Maintenance Commands

- **Local Build:** `npm run build`
- **Linting Check:** `npm run lint` (if configured)
- **Environment Sync:** Always update `.env` with valid Gemini/Supabase keys.
