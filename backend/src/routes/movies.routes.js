import { Router } from 'express'
import ApiError from '../utils/api-error.js'
import {
  getMovieDetails,
  getPopularMovies,
  searchMovies,
} from '../services/tmdb.service.js'

const router = Router()
const DEFAULT_LANGUAGE = 'en-US'
const LANGUAGE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/

function getLanguage(request) {
  const language = request.query.language ?? DEFAULT_LANGUAGE

  if (typeof language !== 'string' || !LANGUAGE_PATTERN.test(language)) {
    throw new ApiError(
      400,
      'INVALID_LANGUAGE',
      'Language must be a valid language code such as en-US.',
    )
  }

  return language
}

function sendMovieResponse(response, data) {
  response.json({ success: true, data })
}

router.get('/popular', async (request, response) => {
  const language = getLanguage(request)
  const movies = await getPopularMovies(language)
  sendMovieResponse(response, movies)
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

router.get('/:id', async (request, response) => {
  const { id } = request.params
  const movieId = Number(id)

  if (!/^[1-9]\d{0,9}$/.test(id) || movieId > 2_147_483_647) {
    throw new ApiError(
      400,
      'INVALID_MOVIE_ID',
      'Movie ID must be a positive integer.',
    )
  }

  const language = getLanguage(request)
  const movie = await getMovieDetails(movieId, language)
  sendMovieResponse(response, movie)
})

export default router
