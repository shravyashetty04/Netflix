# Movieflix – Netflix-style Movie Landing Page (React)

A React front-end that fetches movie data from the **OMDb API** and displays it in a Netflix-style layout.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your OMDb API key** in `src/api/omdb.js`:
   ```js
   const OMDB_API_KEY = "your_api_key_here";
   ```
   Get a free key at: https://www.omdbapi.com/apikey.aspx

## Run

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

Output is in the `dist` folder.

## Features

- React + Vite
- Netflix-style UI: sidebar, hero banner, horizontal movie carousels
- OMDB API integration
- Featured hero with IMDb rating, Play and Watch Trailer
- Scrollable rows with arrow navigation
- Movie detail modal
