# 🦖 Chrome Dino Portfolio

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD627)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An interactive, retro-themed developer portfolio styled after the classic Chrome offline Dinosaur game. Developed using **React**, **TypeScript**, and **Vite**, this application translates personal background, projects, technical skills, and hobbies into a playful, game-like experience.

---

## 🎮 Live Experience & Gameplay

Users explore the portfolio by guiding the retro dinosaur through various "stages" or biomes that serve as resume sections.

*   **Left / Right Screen Clicks**: Move the Dino forward or backward through sections.
*   **Keyboard Controls**:
    *   `Space` or `Right Arrow` ➡️ Advance to the next section
    *   `Left Arrow` ⬅️ Return to the previous section
*   **Dynamically Generated Audio**: Authentic 8-bit sound effects playing on steps and stage completions, synthesised via the browser's native **Web Audio API** (no bulky audio assets required). Includes a mute toggle.
*   **Progress Indicators (HUD)**: Features a retro score display tracking current sections, matching the gameplay layout of the original Chrome easter egg.

---

## ✨ Features

### 1. Retro Pixel-Art Design
All graphics—including the running Dino, clouds, sound toggle, contact icons, and the guitar—are rendered using custom **inline SVG pixel grids**. This ensures the page is exceptionally lightweight, loads instantly, and scales perfectly on high-DPI displays.

### 2. Multi-Biome Adaptive Themes
The environment transitions seamlessly from a light mode to a dark mode as the Dino enters different biomes (such as moving from the Welcome stage into technical Skills and Projects). 

### 3. Integrated Sections
*   **WELCOME**: Interactive startup screen prompting users to click or press buttons to start.
*   **IDENTITY**: A snapshot of Tanmay Mishra's role as a Full Stack Developer.
*   **ABOUT**: Details engineering pursuits, education (B.Tech in IT), and backend/DevOps internship experience.
*   **SKILLS**: Categorized pixel-style chips grouping languages, frontend framework tokens, database systems, and DevOps/Linux tooling.
*   **PROJECTS**: An interactive grid highlighting key creations (Sangwari, RESCAN, VIDEOTUBE, MEGA BLOG) with direct hyperlinks.
*   **BEYOND CODE**: Highlights personal hobbies (music, guitar performance, including a performance on television) with an animated visual audio wave and pixel guitar.
*   **CONTACT**: Interactive directory pointing to Email, GitHub, LinkedIn, and Instagram.
*   **COMPLETE**: Game-over summary screen featuring a **Resume Download** call-to-action and a **Play Again** reset button.

---

## 🛠️ Tech Stack & Architecture

-   **Frontend Library**: [React 19](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (for type safety and autocompletion)
-   **Bundler & Dev Server**: [Vite 8](https://vite.dev/) (fast HMR)
-   **Styling**: Pure CSS embedded natively with keyframe animations (cloud scrolling, text blinking, audio wave-animations) and custom responsive pixel grid layouts.
-   **Audio Engine**: Web Audio API oscillator nodes synthesizing square waves dynamically.

---

## 📂 Project Structure

```text
portfolio/
├── public/                 # Static assets (favicon, resume PDF)
├── src/
│   ├── assets/             # Images and global icons
│   ├── App.css             # Global UI styles
│   ├── App.tsx             # Main React entry component
│   ├── DinoPortfolio.tsx   # Core component (Dino, SVGs, HUD, Audio, and Content)
│   ├── index.css           # Styling system / Fonts
│   └── main.tsx            # React DOM mounting script
├── eslint.config.js        # Linter rules
├── tsconfig.json           # TypeScript configuration files
├── vite.config.ts          # Vite compilation settings
└── package.json            # Scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/TanmayCloud251/DinoPortfolio.git
    cd DinoPortfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the static assets for hosting:

```bash
npm run build
```

This compiles TypeScript and builds the production bundle into the `dist/` directory, optimized for platforms like Vercel, Netlify, or GitHub Pages.

---

## 🎵 Sound Design Details

The sound effects are synthesized programmatically on the fly to eliminate network delays and external assets:

-   **Step/Jump Tone**: A quick square wave oscillator sliding from `150Hz` down to `50Hz` over `0.05` seconds with exponential gain decay.
-   **Clear/Win Tone**: A double note chime (frequency step from `880Hz` to `1100Hz` over `0.15` seconds) notifying the user of a successful section navigation.

---

## 📬 Contact & Socials

-   **Email**: [tanmaycloud251@gmail.com](mailto:tanmaycloud251@gmail.com)
-   **GitHub**: [@TanmayCloud251](https://github.com/TanmayCloud251)
-   **LinkedIn**: [tanmaymi251](https://www.linkedin.com/in/tanmaymi251/)
-   **Instagram**: [@tanmaymishra251](https://www.instagram.com/tanmaymishra251/)
