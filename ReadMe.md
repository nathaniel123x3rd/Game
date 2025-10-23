# 🛑 **[PROJECT ENDED - READ BELOW]** 🛑

> **This project has been discontinued/redacted. It was too much effort with no meaningful return or incentive to continue or dedicate server resources for hosting. The repository remains for archive/reference purposes only.**

---

# Click the Circle Game

A browser-based clicker game with multiple modes, a fully customizable interface, and a Node.js/Express backend for local testing and static serving. This README documents every detail and feature added to the project.

---

## Table of Contents

- [Features](#features)
- [How it Works](#how-it-works)
- [File Structure](#file-structure)
- [Setup & Running Locally](#setup--running-locally)
- [Game Modes](#game-modes)
- [Settings Sidebar](#settings-sidebar)
- [Timer Bar and Powerups](#timer-bar-and-powerups)
- [Styling and Layout](#styling-and-layout)
- [Theme Toggle](#theme-toggle)
- [Why the Project Was Ended](#why-the-project-was-ended)

---

## Features

- **Modes:** Classic, Survival, Precision, Memory (planned), Random Sizes
- **Customizable Settings:** Round length, circle size, difficulty
- **Responsive Sidebar:** Modes and settings always visible on the left
- **Live Info Bar:** Time left, Score, Best — always visible under the title
- **Animated Timer Bar:** Shows remaining time as a bar and as text
- **Multiple Powerups:** +1s, +5s, 2x score, and ultra-rare freeze-timer (❄️)
- **Light/Dark Mode:** Toggle via icon button
- **Express.js Server:** For static file serving and local testing

---

## How it Works

- The game is a single-page web application, using HTML, CSS, and vanilla JavaScript.
- All game files (`index.html`, `style.css`, `script.js`) reside in a `public/` folder.
- An [Express](https://expressjs.com/) Node.js server serves the static files from `public/`, allowing for local testing with `node server.js`.
- The sidebar contains mode selection (with persistent highlighting) and always-visible settings for round length, circle size, and difficulty.
- The main content shows the title, info bar (time, score, best), the animated game area, and game control buttons.
- The timer bar at the top of the game area shows both a colored bar and live time remaining.
- Powerups occasionally appear as special circles, with different effects and drop rates.
- All UI is styled for both dark and light themes, easily toggled with the top-right icon.
- User preferences (theme, settings, best score) are saved in `localStorage`.

---

## File Structure

```
/project-root
  |-- server.js           # Express.js server for local testing
  |-- package.json        # Node.js configuration
  |-- /public
        |-- index.html    # Main HTML for the game
        |-- style.css     # All CSS styles and layout
        |-- script.js     # Game logic and interactivity
```

---

## Setup & Running Locally

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Express server:**
   ```bash
   node server.js
   ```
4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

The Express server uses:
```js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```
This allows you to test the game as if it were hosted, and makes sure all static assets are loaded correctly.

---

## Game Modes

- **Classic:** Standard click-the-circle mode. Score as many points as possible before time runs out.
- **Survival:** Timer starts at 5s, each successful click adds +2s. Game ends if timer hits zero.
- **Precision:** Only earn points for clicking the circle within 0.5s of its appearance.
- **Memory:** Placeholder for a future mode (not implemented).
- **Random Sizes:** Circles appear in random sizes, smaller ones give more points.

---

## Settings Sidebar

- **Round Length:** Set the total time for the round (10–120s).
- **Circle Size:** Choose the default circle size (30–120px).
- **Difficulty:** Easy (slow), Medium, or Hard (fast) — sets how quickly circles move.
- All settings are always visible and can be changed before starting a round.

---

## Timer Bar and Powerups

- **Timer Bar:** Animated bar at the top of the game area shows remaining time. The actual time (e.g., "26s") is displayed within the bar, updating live.
- **Powerups:**
  - **2x:** Double points for a short time.
  - **+5s:** Rare (10% chance), adds 5s to timer.
  - **+1s:** Common (30% chance), adds 1s to timer.
  - **❄️ Freeze:** Ultra-rare (0.1% chance), freezes timer for 10 seconds (bar turns semi-transparent while frozen).

---

## Styling and Layout

- Sidebar and settings are always visible on the left.
- The game and controls are centered.
- Info bar (Time left, Score, Best) is displayed directly below the title.
- Inputs and select fields are large and fully visible.
- The page is pushed slightly upward for a visually balanced look, with minimal top margin.

---

## Theme Toggle

- Top-right icon toggles between dark and light themes.
- The theme state persists via `localStorage`.
- All elements (sidebar, buttons, inputs, game area) adapt to the selected theme.

---

## Why the Project Was Ended

> After significant effort developing a highly customizable, multi-mode game with advanced UI and backend Express integration, I decided to discontinue the project. The primary reasons:
>
> - The return on time invested was not justified.
> - There was no sustainable incentive to dedicate server resources for hosting.
> - The project is preserved for reference and learning, but is no longer actively maintained or hosted.

---

**Thanks for checking out the code! Feel free to fork or reference for your own projects.**
