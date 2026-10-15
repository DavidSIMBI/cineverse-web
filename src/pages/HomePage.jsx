import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieImage from '../components/MovieImage.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, getPopularMovies } from '../services/api.js'

function HomePage() {
  const [response, setResponse] = useState({ attempt: -1, movies: [], error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getPopularMovies({ signal: controller.signal })
      .then((data) => setResponse({ attempt, movies: data.results || [], error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) setResponse({ attempt, movies: [], error: getApiErrorMessage(requestError) })
      })
    return () => controller.abort()
  }, [attempt])

  const currentResponse = response.attempt === attempt
  const movies = currentResponse ? response.movies : []
  const error = currentResponse ? response.error : ''
  const loading = !currentResponse
  const featuredMovie = movies[0]

  return (
    <div className="home-page">
      <section className="hero page-container" aria-label="Featured movie">
        {featuredMovie ? (
          <>
            {featuredMovie.backdrop_path && <MovieImage path={featuredMovie.backdrop_path} size="w1280" alt="" className="hero-backdrop" />}
            <div className="hero-content">
              <span className="eyebrow"><span className="eyebrow-dot" /> Popular on CineVerse</span>
              <h1>{featuredMovie.title || featuredMovie.original_title}</h1>
              <div className="hero-meta">
                {featuredMovie.release_date && <span>{featuredMovie.release_date.slice(0, 4)}</span>}
                {featuredMovie.vote_average > 0 && <span className="rating"><StarRoundedIcon fontSize="small" /> {featuredMovie.vote_average.toFixed(1)} rating</span>}
              </div>
              {featuredMovie.overview && <p className="hero-description">{featuredMovie.overview}</p>}
              <Link className="button-primary" to={`/movie/${featuredMovie.id}`}>Explore film <ArrowForwardRoundedIcon /></Link>
            </div>
          </>
        ) : loading ? (
          <div className="hero-empty"><span className="eyebrow"><span className="eyebrow-dot" /> Discover something new</span><h1>Stories worth staying up for.</h1><p>Loading the latest popular movies…</p></div>
        ) : error ? (
          <div className="hero-empty"><span className="eyebrow"><span className="eyebrow-dot" /> Discover something new</span><h1>Stories worth staying up for.</h1><p>{error}</p><button className="button-secondary" onClick={() => setAttempt((value) => value + 1)}>Try again</button></div>
        ) : (
          <div className="hero-empty"><span className="eyebrow"><span className="eyebrow-dot" /> Discover something new</span><h1>Stories worth staying up for.</h1><p>Explore movie details and find a new favourite.</p><Link className="button-primary" to="/search">Search films <ArrowForwardRoundedIcon /></Link></div>
        )}
      </section>

      <section className="page-container section-block" aria-labelledby="popular-heading">
        <div className="section-heading">
          <div><h2 id="popular-heading">Popular right now</h2><p>What movie fans are exploring today.</p></div>
          <Link className="section-link" to="/search">Find a film <ArrowForwardRoundedIcon fontSize="small" /></Link>
        </div>
        {error || loading ? (
          <RequestState loading={loading} error={error} onRetry={() => setAttempt((value) => value + 1)} />
        ) : movies.length ? (
          <MovieGrid movies={movies.slice(0, 12)} />
        ) : (
          <RequestState empty />
        )}
      </section>
    </div>
  )
}

export default HomePage
