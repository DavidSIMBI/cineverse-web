import { Router } from 'express'
import { getPlaybackSource } from '../services/playback.service.js'
import { getLanguage, getPositiveId } from '../utils/movie-query.js'
import ApiError from '../utils/api-error.js'

const router = Router()

router.get('/:mediaType/:id', async (request, response) => {
  const { mediaType } = request.params
  if (!['movie', 'tv'].includes(mediaType)) {
    throw new ApiError(400, 'INVALID_MEDIA_TYPE', 'Media type must be movie or tv.')
  }
  const id = getPositiveId(request.params.id, 'INVALID_TITLE_ID', 'Title ID')
  const data = await getPlaybackSource(mediaType, id, getLanguage(request))
  response.json({ success: true, data })
})

export default router
