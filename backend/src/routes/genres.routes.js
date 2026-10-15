import { Router } from 'express'
import { getMovieGenres } from '../services/tmdb.service.js'
import { getLanguage } from '../utils/movie-query.js'

const router = Router()

router.get('/', async (request, response) => {
  const data = await getMovieGenres(getLanguage(request))
  response.json({ success: true, data })
})

export default router
