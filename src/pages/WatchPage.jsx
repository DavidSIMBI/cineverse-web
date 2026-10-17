import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import RequestState from '../components/RequestState.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getMovieDetails, getPlaybackSource, getTvDetails } from '../services/api.js'
import { validatePlaybackSource } from '../services/playback.js'

function WatchPage() {
  const { mediaType, id } = useParams()
  const validType = ['movie', 'tv'].includes(mediaType)
  const loadTitle = useCallback((signal) => mediaType === 'tv' ? getTvDetails(id, { signal }) : getMovieDetails(id, { signal }), [mediaType, id])
  const loadTrailer = useCallback((signal) => getPlaybackSource(mediaType, id, { signal }), [mediaType, id])
  const titleState = useApiResource(`watch-title:${mediaType}:${id}`, loadTitle)
  const trailerState = useApiResource(`watch-trailer:${mediaType}:${id}`, loadTrailer)

  if (!validType) return <section className="page-container watch-page"><div className="watch-unavailable" role="alert"><h2>Invalid title type</h2><p>Open a movie or TV series from its details page to view its trailer.</p><Link className="text-link" to="/">Return to CineVerse</Link></div></section>
  if (titleState.loading || titleState.error) return <section className="page-container watch-page"><RequestState loading={titleState.loading} error={titleState.error} onRetry={titleState.retry} /><Link className="text-link" to={mediaType === 'tv' ? '/tv' : '/movies'}>Return to {mediaType === 'tv' ? 'TV shows' : 'movies'}</Link></section>

  const title = mediaType === 'tv'
    ? titleState.data?.name || titleState.data?.original_name || 'Untitled series'
    : titleState.data?.title || titleState.data?.original_title || 'Untitled movie'
  const returnTo = `/${mediaType}/${id}`
  const source = validatePlaybackSource(trailerState.data)

  return <section className="page-container watch-page">
    <div className="watch-heading"><Link className="detail-back-link" to={returnTo}><ArrowBackRoundedIcon /><span>Back to {mediaType === 'tv' ? 'series' : 'movie'} details</span></Link><span className="detail-kicker">CineVerse · trailer</span></div>
    <div className="watch-title"><span className="eyebrow"><span className="eyebrow-dot" /> {source?.official ? 'Official trailer' : 'Trailer'}</span><h1>{title}</h1><p>{mediaType === 'tv' ? titleState.data?.first_air_date || 'TV series trailer' : titleState.data?.release_date || 'Movie trailer'}</p></div>
    {trailerState.loading ? <RequestState loading /> : trailerState.error ? <RequestState error={trailerState.error} onRetry={trailerState.retry} /> : source ? <div className="watch-player-block"><div className="trailer-source-label"><span className="trailer-badge">YOUTUBE TRAILER</span><div><h2>{source.title}</h2><p>{source.official ? 'Official trailer' : 'Trailer'}{source.language ? ` · ${source.language.toUpperCase()}` : ''}</p></div></div><VideoPlayer source={source} /><p className="watch-source-credit">Trailer provided by YouTube. CineVerse does not provide the full movie or series.</p></div> : <div className="watch-unavailable" role="status"><h2>No trailer available</h2><p>TMDB does not list a suitable YouTube trailer for this {mediaType === 'tv' ? 'series' : 'movie'}.</p><Link className="text-link" to={returnTo}>Return to {mediaType === 'tv' ? 'series' : 'movie'} details</Link></div>}
  </section>
}

export default WatchPage
