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

The app also has `/watch/:id`, a separate demo/watch page. Video playback is not required for the movie discovery assignment.

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

Open the local URL printed by Vite. The Vite development server proxies `/api` requests to `http://localhost:3001`. Check the backend at `http://localhost:3001/api/health`.

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

CineVerse is not documented as deployed, and no live URL is provided. The `/api` proxy in `vite.config.js` is for local Vite development only; it does not route production requests.

For production, deploy the Express backend to a Node.js hosting service and make its API publicly reachable. Configure `TMDB_ACCESS_TOKEN` as a secret environment variable on the backend host, and configure its `PORT` according to the host's requirements. Do not add the TMDB token to frontend environment variables or build output.

Deploy the Vite frontend to a static hosting service. Configure that host to forward `/api/*` requests to the deployed backend, or configure a production API base URL in the frontend and allow the deployed frontend origin in Express CORS. The current Express CORS configuration only allows localhost development origins, so production CORS must be updated if the frontend and backend use separate origins. Configure SPA fallback so direct visits to React Router routes such as `/tv/1399` and `/watchlist` serve the frontend entry page.

TMDB attribution is required when displaying TMDB data. See the [TMDB API FAQ](https://developer.themoviedb.org/docs/faq) for the current attribution requirements and include TMDB's required notice in the submitted application.
