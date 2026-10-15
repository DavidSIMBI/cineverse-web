import TheatersRoundedIcon from '@mui/icons-material/TheatersRounded'
import { useState } from 'react'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

function MovieImage({ path, size = 'w500', alt = '', className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)
  const src = path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null

  if (!src || failed === src) {
    return (
      <div
        className={`movie-poster-placeholder ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        <TheatersRoundedIcon aria-hidden="true" />
        <span>Image unavailable</span>
      </div>
    )
  }

  return <img className={className} src={src} alt={alt} loading={loading} onError={() => setFailed(src)} />
}

export default MovieImage
