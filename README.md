# CineVerse

CineVerse is a movie and TV series discovery application. Browse popular movies and series, filter by genre, search across both content types, view title details, and save titles to My Watchlist. The watchlist is stored in the browser's `localStorage` and does not require an account or database.

## Technologies

- React, JavaScript, and Vite
- Material UI and React Router
- Axios for frontend API requests
- Node.js and Express for the backend REST API
- TMDB API for movie and TV metadata

The frontend calls the CineVerse backend. The backend sends authenticated requests to TMDB using a server-side API Read Access Token; the token is never needed in frontend code.

## Features and routes

| Route | Feature |
| --- | --- |
| `/` | Home page with trending, popular, top-rated, and upcoming movies plus trending TV series |
| `/movies` | Popular movies |
| `/tv` | Popular TV series with genre filtering and pagination |
| `/search?query=...` | Search results for movies and TV series |
| `/genres` | Browse movies by genre |
| `/movie/:id` | Movie details and similar movies |
| `/tv/:id` | TV series details |
| `/watchlist` | Saved movies and TV series |

The app also has `/watch/:mediaType/:id` for trailers, where `mediaType` is `movie` or `tv`. Older `/watch/:id` movie links redirect to the explicit movie route. Trailer playback uses YouTube's embedded player; it does not provide a full movie or episode.

## Requirements

- Node.js 20.19+ or 22.12+ and npm
- A TMDB account with an API Read Access Token

## Local setup

From a clean checkout, open a terminal in the project root and install frontend dependencies:

```sh
npm install
```

Install backend dependencies:

```sh
npm install --prefix backend
```

Create the backend environment file from the safe example:

```sh
cp backend/.env.example backend/.env
```

Edit `backend/.env` and replace the placeholder value for `TMDB_ACCESS_TOKEN` with your own TMDB API Read Access Token. Keep the real value in this local environment file. Do not put it in frontend code or share it in source control. The root `.gitignore` excludes environment files while allowing `backend/.env.example`.

Start the backend and frontend in **separate terminals**, both from the project root.

Terminal 1 — backend API (defaults to port 3001):

```sh
npm start --prefix backend
```

Terminal 2 — frontend (Vite defaults to port 5173):

```sh
npm run dev
```

Open the local URL printed by Vite. The backend uses `PORT` from `backend/.env` (default `3001`), and Vite reads that same port setting to proxy `/api` requests. If you override `PORT` in the shell, start both processes with that same value. Check the backend at `http://localhost:<PORT>/api/health`.

## Backend API

API success responses use a JSON object containing `success` and `data`. Errors contain `success` and an `error` object. The `language` parameter defaults to `en-US`.

Main endpoints include:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Backend health check |
| `GET /api/movies/popular` | Popular movies |
| `GET /api/movies/trending` | Trending movies |
| `GET /api/movies/top-rated` | Top-rated movies |
| `GET /api/movies/upcoming` | Upcoming movies |
| `GET /api/movies/search?query=...` | Movie search |
| `GET /api/movies/:id` | Movie details |
| `GET /api/movies/genre/:genreId` | Movies by genre |
| `GET /api/genres` | Movie genres |
| `GET /api/tv/popular` | Popular TV series |
| `GET /api/tv/trending` | Trending TV series |
| `GET /api/tv/genres` | TV genres |
| `GET /api/tv/genre/:genreId` | TV series by genre |
| `GET /api/tv/search?query=...` | Mixed movie and TV search (people are filtered out) |
| `GET /api/tv/:id` | TV series details |
| `GET /api/playback/:mediaType/:id` | Available YouTube trailer for a movie or TV series |

For example, `/api/movies/search?query=The%20Matrix` and `/api/tv/search?query=The%20Bear` search titles. TMDB credentials are required for metadata endpoints. If `TMDB_ACCESS_TOKEN` is missing, the backend reports that TMDB is not configured.

## Quality checks

Run the frontend linter and production build from the project root:

```sh
npm run lint
npm run build
```

To serve the built frontend locally for a preview:

```sh
npm run preview
```

## Deployment

The Vite proxy in `vite.config.js` is for local development only. For Vercel, [vercel.json](vercel.json) forwards `/api/*` requests to the deployed Express API and rewrites other paths to `index.html` for React Router direct navigation and refreshes.

The backend is hosted separately at `https://cineverse-api-kdy7.onrender.com`. Keep `TMDB_ACCESS_TOKEN` configured only as a secret on that backend host. Do not add it to Vercel project environment variables or frontend code. The Vercel rewrite makes browser API calls same-origin with the frontend, so the Express localhost-only CORS list is not used for these proxied browser requests.

For the Vercel project, use the repository root as **Root Directory**, select the **Vite** framework preset, set **Install Command** to `npm install`, **Build Command** to `npm run build`, and **Output Directory** to `dist`. No frontend environment variables are required. No Vercel deployment URL is claimed here; verify the deployed site and its API rewrites from the Vercel project after deployment.

TMDB attribution is required when displaying TMDB data. See the [TMDB API FAQ](https://developer.themoviedb.org/docs/faq) for the current attribution requirements and include TMDB's required notice in the submitted application.
