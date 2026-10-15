import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieImage from '../components/MovieImage.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getMovieDetails } from '../services/api.js'

function formatRuntime(runtime) {
  if (!runtime) return null
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

function MovieDetailsPage() {
  const { id } = useParams()
  const [response, setResponse] = useState({ key: '', movie: null, error: '' })
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${id}:${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    getMovieDetails(id, { signal: controller.signal })
      .then((movie) => setResponse({ key: requestKey, movie, error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) setResponse({ key: requestKey, movie: null, error: getApiErrorMessage(requestError) })
      })
    return () => controller.abort()
  }, [id, attempt, requestKey])

  const currentResponse = response.key === requestKey
  const movie = currentResponse ? response.movie : null
  const error = currentResponse ? response.error : ''
  const loading = !currentResponse

  if (loading || error) {
    return <section className="page-container movie-detail-page detail-state"><RequestState loading={loading} error={error} onRetry={() => setAttempt((value) => value + 1)} /></section>
  }
  if (!movie) return <section className="page-container movie-detail-page"><RequestState empty /></section>

  const title = movie.title || movie.original_title || 'Untitled movie'
  const year = movie.release_date?.slice(0, 4)
  const runtime = formatRuntime(movie.runtime)

  return (
    <article className="page-container movie-detail-page">
      <div className="detail-backdrop">
        {movie.backdrop_path && <MovieImage path={movie.backdrop_path} size="w1280" alt="" />}
        <div className="detail-title-wrap">
          <span className="eyebrow"><span className="eyebrow-dot" /> Movie details</span>
          <h1>{title}</h1>
          <div className="detail-meta">
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
            {movie.vote_average > 0 && <span className="rating"><StarRoundedIcon fontSize="small" /> {movie.vote_average.toFixed(1)} rating</span>}
            {movie.original_language && <span>{movie.original_language.toUpperCase()}</span>}
          </div>
        </div>
      </div>
      <div className="detail-content">
        <div className="detail-poster"><MovieImage path={movie.poster_path} alt={`${title} poster`} /></div>
        <section className="detail-overview">
          <h2>Overview</h2>
          <p>{movie.overview || 'An overview is not available for this movie yet.'}</p>
          {movie.genres?.length > 0 && <div className="genre-list" aria-label="Genres">{movie.genres.map((genre) => <span className="genre-chip" key={genre.id}>{genre.name}</span>)}</div>}
          <div className="metadata-note">This page shows movie information only. Metadata does not provide or authorize full movie playback.</div>
          <div className="detail-actions"><Link className="button-secondary" to="/"><ArrowBackRoundedIcon /> Back to discovery</Link></div>
        </section>
      </div>
    </article>
  )
}

export default MovieDetailsPage
