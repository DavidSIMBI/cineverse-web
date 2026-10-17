import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieImage from '../components/MovieImage.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getTvDetails } from '../services/api.js'
import WatchlistButton from '../components/WatchlistButton.jsx'

function TvDetailsPage() {
  const { id } = useParams()
  const [response, setResponse] = useState({ key: '', show: null, error: '' })
  const [attempt, setAttempt] = useState(0)
  const key = `${id}:${attempt}`
  useEffect(() => {
    const controller = new AbortController()
    getTvDetails(id, { signal: controller.signal }).then((show) => setResponse({ key, show, error: '' })).catch((error) => {
      if (!controller.signal.aborted) setResponse({ key, show: null, error: getApiErrorMessage(error) })
    })
    return () => controller.abort()
  }, [id, attempt, key])
  const current = response.key === key
  const show = current ? response.show : null
  if (!current || response.error) return <section className="page-container movie-detail-page detail-state"><RequestState loading={!current} error={current ? response.error : ''} onRetry={() => setAttempt((value) => value + 1)} /></section>
  if (!show) return <section className="page-container movie-detail-page"><RequestState empty /></section>

  const title = show.name || show.original_name || 'Untitled series'
  return <article className="page-container movie-detail-page">
    <div className="detail-topline"><Link className="detail-back-link" to="/tv"><ArrowBackRoundedIcon /><span>Back to TV shows</span></Link><span className="detail-kicker">CineVerse · TV guide</span></div>
    <div className="detail-backdrop"><MovieImage path={show.backdrop_path} size="w1280" alt="" className="detail-backdrop-image" loading="eager" /><div className="detail-title-wrap"><span className="eyebrow"><span className="eyebrow-dot" /> TV series details</span><h1>{title}</h1><div className="detail-meta"><span className="detail-meta-item">{show.first_air_date || 'First air date unavailable'}</span>{show.vote_average > 0 && <span className="detail-meta-item rating"><StarRoundedIcon fontSize="small" /> {show.vote_average.toFixed(1)} rating</span>}{show.original_language && <span className="detail-meta-item">{show.original_language.toUpperCase()}</span>}</div></div></div>
    <div className="detail-content"><div className="detail-poster"><MovieImage path={show.poster_path} alt={`${title} poster`} /></div><section className="detail-overview"><div className="detail-copy"><span className="detail-section-label">The story</span><h2>Overview</h2><p>{show.overview || 'An overview is not available for this series yet.'}</p></div>{show.genres?.length > 0 && <div className="detail-genres"><h3>Genres</h3><div className="genre-list">{show.genres.map((genre) => <span className="genre-chip" key={genre.id}>{genre.name}</span>)}</div></div>}<div className="detail-watchlist-action"><WatchlistButton item={show} mediaType="tv" /></div></section></div>
  </article>
}

export default TvDetailsPage
