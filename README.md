# Trumpet Exercise App

A browser-based trumpet practice app for (aspiring) musicians. Practice held notes, scales, arpeggios, chromatic scales, and etudes with rendered sheet music in your browser. Play exercises with synthesized trumpet audio, click individual notes to hear them, and see fingering hints under each note.

## Tech Stack

- **Node.js** – Runtime
- **TypeScript** – Type-safe development
- **Vite** – Fast bundling and dev server for browser apps
- **VexFlow** – HTML5 sheet music rendering (SVG)

## User Flow

1. **Categories** – User selects an exercise type (Held Notes, Scales, Arpeggios, Chromatic Scales, Etudes)
2. **Key/Option Selection** – User selects a key or option (e.g., C Major, A Minor, C4 to C5)
3. **Exercise View** – User sees the rendered exercise on a staff with note names and fingerings; can play the full exercise or click individual notes

A **Back** button is available on every screen to return to the previous step. A **Play** button plays the full exercise with synthesized trumpet sound.

## Trumpet Context

- Trumpet uses **treble clef** for notation.
- Trumpet is a **Bb transposition** instrument: written pitch sounds a major 2nd higher than concert pitch. Standard notation in this app is written as you would read it (typical treble clef trumpet parts).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app in the browser with hot reload.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Trumpet/
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── EXERCISE-DATA.md
│   └── flowcharts/
│       ├── user-flow.md
│       └── screen-flow.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.ts
│   ├── styles.css
│   ├── types.ts
│   ├── views/           # CategoryView, KeyView, ExerciseView
│   ├── components/      # BackButton, MusicRenderer (VexFlow)
│   ├── audio/           # trumpetSound – synthesized playback
│   └── data/            # categories, exercises, keys, trumpetFingering
└── ...
```
