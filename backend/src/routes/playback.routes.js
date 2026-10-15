import { Router } from 'express'
import { getPlaybackSource } from '../services/playback.service.js'
import { getPositiveId } from '../utils/movie-query.js'

const router = Router()

router.get('/:id', (request, response) => {
  const movieId = getPositiveId(request.params.id)
  response.json({ success: true, data: getPlaybackSource(movieId) })
})

export default router
