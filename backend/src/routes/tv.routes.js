import { Router } from 'express'
import ApiError from '../utils/api-error.js'
import { getLanguage, getPage, getPositiveId } from '../utils/movie-query.js'
import { getPopularTv, getTrendingTv, getTvGenres, getTvByGenre, searchMulti, getTvDetails } from '../services/tmdb.service.js'

const router = Router()
const sendData = (response, data) => response.json({ success: true, data })

router.get('/popular', async (request, response) => sendData(response, await getPopularTv(getLanguage(request), getPage(request))))
router.get('/trending', async (request, response) => {
  const window = request.query.time_window ?? 'week'
  if (typeof window !== 'string' || !['day', 'week'].includes(window)) {
    throw new ApiError(400, 'INVALID_TIME_WINDOW', 'time_window must be either day or week.')
  }
  sendData(response, await getTrendingTv(window, getLanguage(request), getPage(request)))
})
router.get('/genres', async (request, response) => sendData(response, await getTvGenres(getLanguage(request))))
router.get('/genre/:genreId', async (request, response) => {
  const id = getPositiveId(request.params.genreId, 'INVALID_GENRE_ID', 'Genre ID')
  sendData(response, await getTvByGenre(id, getLanguage(request), getPage(request)))
})
router.get('/search', async (request, response) => {
  const query = request.query.query
  if (typeof query !== 'string' || !query.trim() || query.trim().length > 200) {
    throw new ApiError(400, 'INVALID_SEARCH_QUERY', 'A non-empty search query of 200 characters or fewer is required.')
  }
  const data = await searchMulti(query.trim(), getLanguage(request))
  sendData(response, { ...data, results: (data.results || []).filter((item) => ['movie', 'tv'].includes(item.media_type)) })
})
router.get('/:id', async (request, response) => {
  const id = getPositiveId(request.params.id, 'INVALID_TV_ID', 'TV series ID')
  sendData(response, await getTvDetails(id, getLanguage(request)))
})

export default router
