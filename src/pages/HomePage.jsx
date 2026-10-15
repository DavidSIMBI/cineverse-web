import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import DiscoverySection from '../components/DiscoverySection.jsx'
import MovieImage from '../components/MovieImage.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getPopularMovies, getTopRatedMovies, getTrendingMovies, getUpcomingMovies } from '../services/api.js'

function results(data) { return Array.isArray(data?.results) ? data.results : [] }
function withoutIds(movies, ids) { return movies.filter((movie) => !ids.has(movie.id)) }
function remember(movies, ids) { movies.forEach((movie) => ids.add(movie.id)); return movies }

function HomePage() {
  const loadPopular = useCallback((signal) => getPopularMovies({ signal }), [])
  const loadTrending = useCallback((signal) => getTrendingMovies({ signal }), [])
  const loadTopRated = useCallback((signal) => getTopRatedMovies({ signal }), [])
  const loadUpcoming = useCallback((signal) => getUpcomingMovies({ signal }), [])
  const popular = useApiResource('home-popular', loadPopular)
  const trending = useApiResource('home-trending', loadTrending)
  const topRated = useApiResource('home-top-rated', loadTopRated)
  const upcoming = useApiResource('home-upcoming', loadUpcoming)

  const popularMovies = results(popular.data)
  const trendingMovies = results(trending.data)
  const featuredMovie = popularMovies[0] || trendingMovies[0]
  const seen = new Set(featuredMovie ? [featuredMovie.id] : [])
  const uniqueTrending = remember(withoutIds(trendingMovies, seen), seen)
  const uniquePopular = remember(withoutIds(popularMovies, seen), seen)
  const uniqueTopRated = remember(withoutIds(results(topRated.data), seen), seen)
  const uniqueUpcoming = withoutIds(results(upcoming.data), seen)

  return (
    <div className="home-page">
      <section className="hero page-container" aria-label="Featured movie">
        {featuredMovie ? <>
          {featuredMovie.backdrop_path && <MovieImage path={featuredMovie.backdrop_path} size="w1280" alt="" className="hero-backdrop" loading="eager" />}
          <div className="hero-content">
            <span className="eyebrow"><span className="eyebrow-dot" /> Featured discovery</span>
            <h1>{featuredMovie.title || featuredMovie.original_title}</h1>
            <div className="hero-meta">
              {featuredMovie.release_date && <span>{featuredMovie.release_date.slice(0, 4)}</span>}
              {featuredMovie.vote_average > 0 && <span className="rating"><StarRoundedIcon fontSize="small" /> {featuredMovie.vote_average.toFixed(1)} rating</span>}
            </div>
            {featuredMovie.overview && <p className="hero-description">{featuredMovie.overview}</p>}
            <Link className="button-primary" to={`/movie/${featuredMovie.id}`}>Explore film <ArrowForwardRoundedIcon /></Link>
          </div>
        </> : <div className="hero-empty">
          <span className="eyebrow"><span className="eyebrow-dot" /> Discover something new</span>
          <h1>Stories worth staying up for.</h1>
          <p>{popular.error || trending.error || (popular.loading || trending.loading ? 'Loading movie picks…' : 'Explore movie details and find a new favourite.')}</p>
          {popular.error || trending.error ? <button className="button-secondary" onClick={() => { popular.retry(); trending.retry() }}>Try again</button> : !popular.loading && !trending.loading && <Link className="button-primary" to="/search">Search films <ArrowForwardRoundedIcon /></Link>}
        </div>}
      </section>

      <section className="page-container video-demo-entry" aria-labelledby="video-demo-heading">
        <div className="video-demo-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> Try the player</span>
          <h2 id="video-demo-heading">Video Player Demo</h2>
          <p>Open a short CC0 flower sample to try the player controls. This demo clip is not the movie shown on its watch page.</p>
        </div>
        <Link className="button-secondary" to="/watch/550" aria-label="Open the video player demo">
          <PlayArrowRoundedIcon /> Open demo player
        </Link>
      </section>

      <DiscoverySection id="trending" title="Trending Movies" description="The movies people are talking about this week." movies={uniqueTrending} loading={trending.loading} error={trending.error} onRetry={trending.retry} />
      <DiscoverySection id="popular" title="Popular Movies" description="Fan favourites from across the catalogue." movies={uniquePopular} loading={popular.loading} error={popular.error} onRetry={popular.retry} link={{ to: '/search', label: 'Search all films' }} />
      <DiscoverySection id="top-rated" title="Top Rated Movies" description="Highly rated films worth adding to your list." movies={uniqueTopRated} loading={topRated.loading} error={topRated.error} onRetry={topRated.retry} />
      <DiscoverySection id="upcoming" title="Upcoming Movies" description="New releases listed by TMDB." movies={uniqueUpcoming} loading={upcoming.loading} error={upcoming.error} onRetry={upcoming.retry} />
    </div>
  )
}

export default HomePage
