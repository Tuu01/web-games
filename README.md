# Web Games (Offline Game Vault)

Mobile-first, offline-ready party games built with React + Vite. Current game: **Word Imposter**.

Live: `https://games.tuuhyped.co.uk`

## Features
- Offline-capable PWA (service worker)
- Word Imposter: setup -> deal -> discuss -> reveal
- Drag-to-reveal role dealing
- Imposter gets **group hint** (not the secret word)
- Timer with presets
- Random first-player picker
- Bilingual UI (EN/VI)
- Content editable via JSON

## Tech Stack
- React 18
- Vite 5
- Plain CSS
- PWA service worker

## Project Structure
```
src/
  games/word-imposter/
    logic.js
    screens/
  screens/         # Home/Settings/Loading
  hooks/           # JSON loaders
  lib/             # utils
public/
  words.json        # game data
  i18n.json         # UI text
  sw.js             # service worker
```

## Data Files
### `public/words.json`
- `category`: category name
- `groups[]`:
  - `hint`: `{ en, vi }` (used as the imposter word)
  - `words`: `{ en[], vi[] }` (used by non-imposters)

### `public/i18n.json`
- Language keys: `en`, `vi`
- UI labels + `categoryLabels`

## Setup
```bash
npm install
```

## Run (Dev)
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Deploy (Vercel)
- Build command: `npm run build`
- Output directory: `dist`

## Notes
- In dev, service worker is disabled (only registers in production).
- If updates don't appear in production, bump cache version in `public/sw.js`.

## License
[Add license here]
