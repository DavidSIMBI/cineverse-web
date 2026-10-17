import ApiError from '../utils/api-error.js'

const TMDB_API_URL = 'https://api.themoviedb.org/3'
const REQUEST_TIMEOUT_MS = 10_000

async function requestTmdb(path, params = {}) {
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim()

  if (!accessToken) {
    throw new ApiError(
      503,
      'TMDB_NOT_CONFIGURED',
      'Movie services are not configured. Set TMDB_ACCESS_TOKEN in backend/.env.',
    )
  }

  const url = new URL(`${TMDB_API_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  let tmdbResponse

  try {
    tmdbResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new ApiError(
        504,
        'TMDB_TIMEOUT',
        'The movie service took too long to respond. Please try again.',
      )
    }

    throw new ApiError(
      502,
      'TMDB_NETWORK_ERROR',
      'The movie service could not be reached. Please try again later.',
    )
  }

  if (!tmdbResponse.ok) {
    if (tmdbResponse.status === 401 || tmdbResponse.status === 403) {
      throw new ApiError(
        502,
        'TMDB_AUTHENTICATION_FAILED',
        'The movie service rejected its configured credentials.',
      )
    }

    if (tmdbResponse.status === 429) {
      throw new ApiError(
        503,
        'TMDB_RATE_LIMITED',
        'The movie service is receiving too many requests. Please try again later.',
      )
    }

    if (tmdbResponse.status === 404) {
      throw new ApiError(404, 'MOVIE_NOT_FOUND', 'The requested movie was not found.')
    }

    if (tmdbResponse.status >= 500) {
      throw new ApiError(
        502,
        'TMDB_UNAVAILABLE',
        'The movie service is temporarily unavailable. Please try again later.',
      )
    }

    throw new ApiError(
      502,
      'TMDB_REQUEST_FAILED',
      'The movie service could not complete the request.',
    )
  }

  try {
    return await tmdbResponse.json()
  } catch {
    throw new ApiError(
      502,
      'TMDB_INVALID_RESPONSE',
      'The movie service returned an invalid response.',
    )
  }
}

export function getPopularMovies(language) {
  return requestTmdb('/movie/popular', { language })
}

export function getTrendingMovies(timeWindow, language, page) {
  return requestTmdb(`/trending/movie/${timeWindow}`, { language, page })
}

export function getTopRatedMovies(language, page) {
  return requestTmdb('/movie/top_rated', { language, page })
}

export function getUpcomingMovies(language, page) {
  return requestTmdb('/movie/upcoming', { language, page })
}

export function getMovieGenres(language) {
  return requestTmdb('/genre/movie/list', { language })
}

export function getMoviesByGenre(genreId, language, page) {
  return requestTmdb('/discover/movie', { with_genres: genreId, language, page })
}

export function getSimilarMovies(movieId, language, page) {
  return requestTmdb(`/movie/${movieId}/similar`, { language, page })
}

export function searchMovies(query, language) {
  return requestTmdb('/search/movie', { query, language })
}

export function getMovieDetails(movieId, language) {
  return requestTmdb(`/movie/${movieId}`, { language })
}

export function getPopularTv(language, page = 1) {
  return requestTmdb('/tv/popular', { language, page })
}

export function getTrendingTv(timeWindow, language, page = 1) {
  return requestTmdb(`/trending/tv/${timeWindow}`, { language, page })
}

export function getTvGenres(language) {
  return requestTmdb('/genre/tv/list', { language })
}

export function getTvByGenre(genreId, language, page = 1) {
  return requestTmdb('/discover/tv', { with_genres: genreId, language, page })
}

export function searchMulti(query, language) {
  return requestTmdb('/search/multi', { query, language })
}

export function getTvDetails(tvId, language) {
  return requestTmdb(`/tv/${tvId}`, { language })
}
