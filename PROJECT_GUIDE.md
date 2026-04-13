# CodeSage || Project Architecture & Component Map

This document serves as a guide for manual developers to navigate the CodeSage codebase. If you need to change a specific part of the UI or logic, find the element below to see which file to edit.

---

## 🎨 Styling System (CSS)

All theme colors (Red & Black) are controlled via CSS.

| Style Scope | File Path | What's Inside? |
| :--- | :--- | :--- |
| **Global Theme** | `src/styles/global.css` | Color variables, `.primary-btn`, Nav bar, Base layout, and Engine Sidebar. |
| **Landing Page** | `src/components/Hero.jsx` | Inline styles for the Hero section and animated marquee cards. |
| **Login/Logout** | `src/styles/login.css` | Glassmorphism card styles for auth pages. |
| **Analytics View** | `src/styles/analytics.css` | Score circles, Diff (Code comparison) colors, and Insight cards. |
| **User Profile** | `src/styles/profile.css` | Dashboard layout and history log styling. |
| **Preloader** | `src/styles/preloader.css` | Car-tire spinning animation and syntax symbols. |

---

## 🧩 Component Map

### 1. Landing & Navigation
*   **Top Navigation Bar**: `src/components/TopNavigation.jsx`
    *   Contains: Logo, "Login / Signup" button, User Profile circle (when logged in).
*   **Hero Section**: `src/components/Hero.jsx`
    *   Contains: Big "◇" logo, "CodeSage" title (Bloody Red), "Launch System" button, and the dual-row marquee banner.

### 2. The Neural Engine (Core App)
*   **Main Workspace**: `src/components/CodeIntegrityEngine.jsx`
    *   Contains: The Sidebar (Dashboard/History), The Code Editor (Textarea), and the "Analyze Code" button.
    *   *Logic*: The `analyzeCode()` function handles the Gemini AI request.
*   **Analysis Results**: `src/components/Analytics.jsx`
    *   Contains: Code Score circle, Bugs list, Optimization list, and the Refactored Code comparison.
    *   *Action*: "Export PDF" button (triggers `window.print()`).

### 3. Authentication Flow
*   **Login Screen**: `src/components/Login.jsx`
    *   Contains: Email/Password inputs, "You are not a user" error handling.
*   **Logout Confirmation**: `src/components/Logout.jsx`
    *   Contains: "Session Terminated" message and auto-redirect timer.
*   **Identity Verification**: `src/components/confirmation.jsx`
    *   Contains: Post-email-click success screen with the Checkmark icon.

### 4. Identity & Profile
*   **Profile Dashboard**: `src/components/Profile.jsx`
    *   Contains: Account settings, Avatar change (URL), and the Persistent Review History list.
*   **User Dropdown**: `src/components/UserProfile.jsx`
    *   Contains: The logic for the dropdown menu that appears when clicking the profile circle in the header.

---

## ⚙️ Configuration & Backend

*   **Main Controller**: `src/App.jsx`
    *   Handles view switching (Landing vs Engine) and the Supabase auth listener.
*   **Database Config**: `src/supabaseclient.js`
    *   Credentials for Supabase Auth and Database.
*   **AI Middleware**: `vite.config.js`
    *   Redirects the `/review` API calls to the Google Gemini backend.

---

## 🚀 Quick Reference: "I want to change..."

*   **The color of the main name**: GO TO `src/components/Hero.jsx` -> `linear-gradient` inside the `<h1>`.
*   **The speed of the marquee**: GO TO `src/components/Hero.jsx` -> `@keyframes marquee`.
*   **The AI prompt/logic**: GO TO `src/components/CodeIntegrityEngine.jsx` -> `analyzeCode()` function.
*   **The Global Red variations**: GO TO `src/styles/global.css` -> Search for `#ff4d4d` or `rgba(255, 77, 77, ...)`.
*   **The Logo**: All logos are stylized "◇" characters (unicode). You can change them in `Hero.jsx`, `TopNavigation.jsx`, and `CodeIntegrityEngine.jsx`.
