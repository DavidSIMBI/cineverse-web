import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import RequestState from '../components/RequestState.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getMovieDetails, getPlaybackSource } from '../services/api.js'
import { validatePlaybackSource } from '../services/playback.js'

function WatchPage() {
  const { id } = useParams()
  const loadMovie = useCallback((signal) => getMovieDetails(id, { signal }), [id])
  const loadPlayback = useCallback((signal) => getPlaybackSource(id, { signal }), [id])
  const movieState = useApiResource(`watch-movie:${id}`, loadMovie)
  const playbackState = useApiResource(`watch-source:${id}`, loadPlayback)

  if (movieState.loading || movieState.error) {
    return <section className="page-container watch-page"><RequestState loading={movieState.loading} error={movieState.error} onRetry={movieState.retry} /></section>
  }

  const movie = movieState.data
  if (!movie) return <section className="page-container watch-page"><RequestState empty /></section>

  const title = movie.title || movie.original_title || 'Untitled movie'
  const source = validatePlaybackSource(playbackState.data)
  const sourceKindLabel = source?.kind === 'demo' ? 'DEMO CLIP' : source?.kind === 'trailer' ? 'AUTHORIZED TRAILER' : 'AUTHORIZED VIDEO'

  return (
    <section className="page-container watch-page">
      <div className="watch-heading">
        <Link className="detail-back-link" to={`/movie/${id}`}><ArrowBackRoundedIcon /><span>Back to movie details</span></Link>
        <span className="detail-kicker">CineVerse · watch page</span>
      </div>
      <div className="watch-title"><span className="eyebrow"><span className="eyebrow-dot" /> Movie information</span><h1>{title}</h1>
        <p>{[movie.release_date?.slice(0, 4), movie.runtime ? `${movie.runtime} min` : null, movie.original_language?.toUpperCase()].filter(Boolean).join(' · ') || 'Movie metadata'}</p>
      </div>
      {playbackState.loading ? <RequestState loading /> : playbackState.error ? <RequestState error={playbackState.error} onRetry={playbackState.retry} /> : source ? (
        <div className="watch-player-block">
          <div className="demo-source-label"><span className="demo-badge">{sourceKindLabel}</span><div><h2>{source.title}</h2><p>{source.description}</p></div></div>
          <VideoPlayer source={source} />
          <p className="watch-source-credit">{source.attribution} · {source.license}.{source.kind === 'demo' ? ' This sample clip is not the movie shown above.' : ''}</p>
        </div>
      ) : (
        <div className="watch-unavailable" role="status"><h2>No authorized video source is available</h2><p>CineVerse has movie information for this title, but no licensed playback source is configured. Movie posters and metadata do not provide permission to stream a film.</p><Link className="text-link" to={`/movie/${id}`}>Return to movie details</Link></div>
      )}
    </section>
  )
}

export default WatchPage
