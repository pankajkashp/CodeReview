# ◇ Kinetic Void : AI Code Reviewer

An ultra-modern, cinematic React web application designed to simulate an advanced AI Code Integrity Engine. This project focuses on delivering a highly premium user experience with complex CSS animations, dark mode aesthetics, and an integrated Supabase authentication flow.

## 🚀 Key Features

- **Cinematic Preloader Sequence**: A dynamic 3-part animation where syntax symbols scatter from the edges, rapidly orbit the center in a cluster, and burst outwards to reveal the application.
- **Supabase Authentication**: Integrated Google OAuth login via Supabase. Protected routes and dynamic navigation updates based on the user's session state.
- **Code Integrity Engine**: A responsive and interactive dashboard simulating live AI code analysis, featuring a collapsible hovering sidebar and syntax-highlighted code editor.
- **Analytics Dashboard**: A beautifully designed analytics page tracking "Code Score", bugs detected, and clean code suggestions alongside a visual code diff comparing legacy vs. refactored source.
- **Modern UI/UX**: Built purely with native CSS using glowing accents (`#55e7ff` signature cyan), dashed borders, glassmorphic elements, and fluid layouts.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure CSS (`global.css`, `preloader.css`, `analytics.css`)
- **Backend / Auth**: Supabase (Google OAuth)

## 📦 Project Structure

```text
src/
├── components/
│   ├── Preloader.jsx           # Animated website entry sequence
│   ├── TopNavigation.jsx       # Header nav tracking session state
│   ├── Hero.jsx                # Landing page hero sequence
│   ├── CodeIntegrityEngine.jsx # Main AI review dashboard workspace
│   ├── Analytics.jsx           # AI optimization results breakdown
│   └── ...                     # Additional landing page segments
├── styles/
│   ├── global.css              # Core typography, themes, and layouts
│   ├── preloader.css           # Keyframe animations for the preloader
│   └── analytics.css           # Styling for the analytics dashboard
├── App.jsx                     # Root application and auth router
└── main.jsx                    # Vite entry point
```

## ⚙️ Local Development Setup

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/pankajkashp/CodeReview.git
cd CodeReview
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables**
Create a `.env` file in the root directory and populate it with your Supabase credentials to enable the Google Login functionality:
\`\`\`env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
\`\`\`

**4. Start the development server**
\`\`\`bash
npm run dev
\`\`\`
The application will be accessible at `http://localhost:5173`.

## 🎨 Design Philosophy
The system avoids generic component libraries and tailwind utility classes, opting instead for meticulously crafted native CSS rules to ensure absolute control over every micro-interaction, transition, and glow effect. The result is an interface that feels significantly more responsive, unique, and "alive".
