# Vedant Potdar · Portfolio

A single-page developer portfolio in plain HTML, CSS and JavaScript. No build step and no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Before publishing

1. Put your resume at `assets/Vedant_Potdar_Resume.pdf` (the "Resume" button links there).
2. Fill in your links at the top of `script.js` (the `LINKS` object): GitHub, LinkedIn, Google Play, App Store, and the Data Structures Visualizer repo and demo. Links left as `#` stay inactive.

## Publish for free

- **GitHub Pages:** push this folder to a repo, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel:** drag and drop the folder, or connect the repo. No build command, publish directory `.`.

## What's inside

| File | Purpose |
| --- | --- |
| `index.html` | All content and sections |
| `styles.css` | Theme (dark/light), layout and animations |
| `script.js` | Loader, typing effect, terminal intro, particle background, tilt cards, cursor, filters, counters |
| `features.js` / `features.css` | Chat assistant, live terminal, project case studies, command palette, easter eggs |

## Interactive extras

- **Chat assistant** (bottom-right button): a scripted assistant that answers questions about skills, projects, experience and contact. It runs entirely in the browser with keyword matching, so it needs no API key and makes no network calls. Answers live in the `R` and `INTENTS` objects in `features.js`.
- **Live terminal** (About section): after the intro plays, visitors can type commands. `help` lists them.
- **Case studies**: each project card has a "Case study" button that opens a popup with the problem, an animated flow diagram, what was built and the outcome. Content lives in the `CASES` object in `features.js`.
- **Command palette**: press `Ctrl K` (`⌘ K` on Mac) or `/` to jump anywhere or run an action.
- **Easter eggs**: `sudo hire-vedant` in the terminal, and the Konami code (↑ ↑ ↓ ↓ ← → ← → B A).

Animations switch off automatically for visitors who have "reduce motion" turned on.
