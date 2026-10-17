import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getPlaybackSource } from '../services/api.js'
import useApiResource from '../hooks/useApiResource.js'
import { validatePlaybackSource } from '../services/playback.js'

function TrailerAction({ mediaType, id }) {
  const loadTrailer = useCallback((signal) => getPlaybackSource(mediaType, id, { signal }), [mediaType, id])
  const trailer = useApiResource(`trailer:${mediaType}:${id}`, loadTrailer)
  const source = validatePlaybackSource(trailer.data)

  if (trailer.loading) return <span className="watch-availability" role="status">Checking trailer availability…</span>
  if (trailer.error) return <>
    <span className="watch-availability" role="status">Trailer availability could not be checked.</span>
    <span className="watch-availability trailer-error-detail" role="alert">{trailer.error}</span>
    <button className="button-secondary" type="button" onClick={trailer.retry}><RefreshRoundedIcon /> Retry</button>
  </>
  if (!source) return <span className="watch-availability" role="status">No YouTube trailer is available for this title.</span>

  return <>
    <Link className="button-primary" to={`/watch/${mediaType}/${id}`}><PlayArrowRoundedIcon /> Watch Trailer</Link>
    <span className="watch-availability">Trailer hosted on YouTube; this is not the full movie or series.</span>
  </>
}

export default TrailerAction
