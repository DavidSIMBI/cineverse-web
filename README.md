# CineVerse

CineVerse is a student movie discovery application. The project has a React + Vite frontend and a separate Node.js + Express backend. The backend provides a small REST API and securely requests movie metadata from TMDB. It does not provide full movie streaming.

## Backend setup

The backend is in `backend/`. From the project root, install its dependencies with:

```sh
npm install --prefix backend
```

Create a local environment file from the example:

```sh
cp backend/.env.example backend/.env
```

Open `backend/.env` and replace `your_tmdb_api_read_access_token_here` with your TMDB API Read Access Token. Keep this value in that local file only; never put it in frontend code or commit it. `.env` files are excluded by the root `.gitignore`.

Start the backend from the project root:

```sh
npm start --prefix backend
```

By default, the API listens on `http://localhost:3001`. Set `PORT` in `backend/.env` to use a different port.

## TMDB access

Create or sign in to a TMDB account, then request an API credential from the **API** section of your account settings. This backend expects the API Read Access Token and sends it to TMDB in an `Authorization: Bearer` header. TMDB documents this search-then-details flow in its [official API guide](https://developer.themoviedb.org/docs/search-and-query-for-details).

If `TMDB_ACCESS_TOKEN` is missing, movie endpoints return HTTP `503` with a `TMDB_NOT_CONFIGURED` error. Invalid TMDB credentials and upstream errors are reported without including the token or internal stack traces.

## REST endpoints

All movie endpoints return a JSON object with `success` and `data` fields on success, or `success` and an `error` object on failure. The optional `language` parameter defaults to `en-US`.

Check that the backend is running:

```http
GET http://localhost:3001/api/health
```

Get popular movies:

```http
GET http://localhost:3001/api/movies/popular?language=en-US
```

Search by title (URL-encode the query when needed):

```http
GET http://localhost:3001/api/movies/search?query=The%20Matrix&language=en-US
```

Get a movie's details by its TMDB ID:

```http
GET http://localhost:3001/api/movies/603?language=en-US
```

The movie search and detail routes are proxies for TMDB metadata. Posters, summaries, and trailer metadata do not grant rights to stream a full movie. Playback requires a separate authorized video source.

## TMDB attribution

TMDB's developer API is available for non-commercial use with attribution. When displaying TMDB data or images in the application, include an approved TMDB logo and show this notice prominently in an About or Credits area:

> This product uses the TMDB API but is not endorsed or certified by TMDB.

See TMDB's [API FAQ and attribution requirements](https://developer.themoviedb.org/docs/faq). Commercial use requires a separate license from TMDB.

## Frontend

The Vite development server can be started from the project root with:

```sh
npm run dev
```
