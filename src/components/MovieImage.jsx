import TheatersRoundedIcon from '@mui/icons-material/TheatersRounded'
import { useState } from 'react'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

function MovieImage({ path, size = 'w500', alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null

  if (!src || failed === src) {
    return (
      <div className={`movie-poster-placeholder ${className}`} aria-label={alt || 'Movie image unavailable'}>
        <TheatersRoundedIcon aria-hidden="true" />
        <span>Image unavailable</span>
      </div>
    )
  }

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(src)} />
}

export default MovieImage
