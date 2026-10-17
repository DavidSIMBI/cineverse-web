import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DiscoverySection from '../components/DiscoverySection.jsx'
import MovieImage from '../components/MovieImage.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getMovieDetails, getPlaybackSource, getSimilarMovies } from '../services/api.js'
import useApiResource from '../hooks/useApiResource.js'
import { validatePlaybackSource } from '../services/playback.js'
import WatchlistButton from '../components/WatchlistButton.jsx'

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
  const loadSimilar = useCallback((signal) => getSimilarMovies(id, { signal }), [id])
  const loadPlayback = useCallback((signal) => getPlaybackSource(id, { signal }), [id])
  const similar = useApiResource(`similar:${id}`, loadSimilar)
  const playback = useApiResource(`detail-playback:${id}`, loadPlayback)

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
  const playbackSource = validatePlaybackSource(playback.data)
  const playbackLabel = playbackSource?.kind === 'demo'
    ? 'Play Demo'
    : playbackSource?.kind === 'trailer'
      ? 'Watch Trailer'
      : 'Watch Movie'

  return (
    <>
    <article className="page-container movie-detail-page">
      <div className="detail-topline">
        <Link className="detail-back-link" to="/">
          <ArrowBackRoundedIcon /> <span>Back to discovery</span>
        </Link>
        <span className="detail-kicker">CineVerse · film guide</span>
      </div>
      <div className="detail-backdrop">
        <MovieImage path={movie.backdrop_path} size="w1280" alt="" className="detail-backdrop-image" loading="eager" />
        <div className="detail-title-wrap">
          <span className="eyebrow"><span className="eyebrow-dot" /> Movie details</span>
          <h1>{title}</h1>
          <div className="detail-meta">
            <span className="detail-meta-item">{year || 'Release date unavailable'}</span>
            {runtime && <span className="detail-meta-item">{runtime}</span>}
            {movie.vote_average > 0 && <span className="detail-meta-item rating"><StarRoundedIcon fontSize="small" /> {movie.vote_average.toFixed(1)} rating</span>}
            {movie.original_language && <span className="detail-meta-item">{movie.original_language.toUpperCase()}</span>}
          </div>
        </div>
      </div>
      <div className="detail-content">
        <div className="detail-poster"><MovieImage path={movie.poster_path} alt={`${title} poster`} /></div>
        <section className="detail-overview">
          <div className="detail-copy">
            <span className="detail-section-label">The story</span>
            <h2>Overview</h2>
            <p>{movie.overview || 'An overview is not available for this movie yet.'}</p>
          </div>
          {movie.genres?.length > 0 && (
            <div className="detail-genres">
              <h3>Genres</h3>
              <div className="genre-list">{movie.genres.map((genre) => <span className="genre-chip" key={genre.id}>{genre.name}</span>)}</div>
            </div>
          )}
          <div className="detail-watch-action">
            {playback.loading ? <span className="watch-availability" role="status">Checking video availability…</span> : playback.error ? <>
              <span className="watch-availability" role="status">Video availability could not be checked.</span>
              <button className="button-secondary" type="button" onClick={playback.retry}><RefreshRoundedIcon /> Retry</button>
              <Link className="button-secondary" to={`/watch/${id}`}>View watch page</Link>
            </> : playbackSource ? <>
              <Link className="button-primary" to={`/watch/${id}`}><PlayArrowRoundedIcon /> {playbackLabel}</Link>
              {playbackSource.kind === 'demo' && <span className="watch-availability">Demo clip only — this is not the movie.</span>}
            </> : <>
              <span className="watch-availability">No authorized video source is available for this movie.</span>
              <Link className="button-secondary" to={`/watch/${id}`}>View watch page</Link>
            </>}
          </div>
          <div className="detail-watchlist-action"><WatchlistButton item={movie} mediaType="movie" /></div>
          <div className="metadata-note">This page shows movie information only. Metadata does not provide or authorize full movie playback.</div>
        </section>
      </div>
    </article>
    <DiscoverySection id="similar" title="Similar Movies" description={`More films with a feel like ${title}.`} movies={similar.data?.results || []} loading={similar.loading} error={similar.error} onRetry={similar.retry} />
    </>
  )
}

export default MovieDetailsPage
