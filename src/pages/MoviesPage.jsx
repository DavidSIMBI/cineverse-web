import { useCallback } from 'react'
import MovieGrid from '../components/MovieGrid.jsx'
import RequestState from '../components/RequestState.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getPopularMovies } from '../services/api.js'

function MoviesPage() {
  const loadMovies = useCallback((signal) => getPopularMovies({ signal }), [])
  const movies = useApiResource('movies-page-popular', loadMovies)
  const results = (movies.data?.results || []).map((movie) => ({ ...movie, media_type: 'movie' }))
  return <section className="page-container genre-page"><div className="page-heading"><span className="eyebrow"><span className="eyebrow-dot" /> Film discovery</span><h1>Movies</h1><p>Popular movies from across the TMDB catalogue.</p></div>{movies.loading || movies.error ? <RequestState loading={movies.loading} error={movies.error} onRetry={movies.retry} /> : results.length ? <MovieGrid movies={results} /> : <RequestState empty />}</section>
}

export default MoviesPage
