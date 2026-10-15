import { Router } from 'express'
import ApiError from '../utils/api-error.js'
import { getLanguage, getPage, getPositiveId } from '../utils/movie-query.js'
import {
  getMovieDetails,
  getMoviesByGenre,
  getPopularMovies,
  getSimilarMovies,
  searchMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from '../services/tmdb.service.js'

const router = Router()

function sendMovieResponse(response, data) {
  response.json({ success: true, data })
}

router.get('/popular', async (request, response) => {
  const language = getLanguage(request)
  const movies = await getPopularMovies(language)
  sendMovieResponse(response, movies)
})

router.get('/trending', async (request, response) => {
  const timeWindow = request.query.time_window ?? 'week'
  if (typeof timeWindow !== 'string' || !['day', 'week'].includes(timeWindow)) {
    throw new ApiError(400, 'INVALID_TIME_WINDOW', 'time_window must be either day or week.')
  }
  sendMovieResponse(response, await getTrendingMovies(timeWindow, getLanguage(request), getPage(request)))
})

router.get('/top-rated', async (request, response) => {
  sendMovieResponse(response, await getTopRatedMovies(getLanguage(request), getPage(request)))
})

router.get('/upcoming', async (request, response) => {
  sendMovieResponse(response, await getUpcomingMovies(getLanguage(request), getPage(request)))
})

router.get('/genre/:genreId', async (request, response) => {
  const genreId = getPositiveId(request.params.genreId, 'INVALID_GENRE_ID', 'Genre ID')
  sendMovieResponse(response, await getMoviesByGenre(genreId, getLanguage(request), getPage(request)))
})

router.get('/search', async (request, response) => {
  const { query } = request.query

  if (typeof query !== 'string' || !query.trim()) {
    throw new ApiError(
      400,
      'INVALID_SEARCH_QUERY',
      'A non-empty query parameter is required.',
    )
  }

  if (query.trim().length > 200) {
    throw new ApiError(
      400,
      'INVALID_SEARCH_QUERY',
      'The search query must be 200 characters or fewer.',
    )
  }

  const language = getLanguage(request)
  const results = await searchMovies(query.trim(), language)
  sendMovieResponse(response, results)
})

router.get('/:id/similar', async (request, response) => {
  const movieId = getPositiveId(request.params.id)
  sendMovieResponse(response, await getSimilarMovies(movieId, getLanguage(request), getPage(request)))
})

router.get('/:id', async (request, response) => {
  const movieId = getPositiveId(request.params.id)
  const language = getLanguage(request)
  const movie = await getMovieDetails(movieId, language)
  sendMovieResponse(response, movie)
})

export default router
