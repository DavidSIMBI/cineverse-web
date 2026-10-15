import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid.jsx'
import RequestState from '../components/RequestState.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getGenres, getMoviesByGenre } from '../services/api.js'

function GenreBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawGenre = searchParams.get('genre') || ''
  const rawPage = searchParams.get('page') || '1'
  const genreId = /^[1-9]\d{0,9}$/.test(rawGenre) ? rawGenre : ''
  const page = /^[1-9]\d{0,2}$/.test(rawPage) && Number(rawPage) <= 500 ? Number(rawPage) : 1
  const loadGenres = useCallback((signal) => getGenres({ signal }), [])
  const loadMovies = useCallback((signal) => genreId ? getMoviesByGenre(genreId, { page, signal }) : Promise.resolve(null), [genreId, page])
  const genresState = useApiResource('genres', loadGenres)
  const moviesState = useApiResource(`genre:${genreId}:page:${page}`, loadMovies)
  const genres = Array.isArray(genresState.data?.genres) ? genresState.data.genres : []
  const selectedGenre = genres.find((genre) => String(genre.id) === genreId)
  const movieData = moviesState.data
  const movies = Array.isArray(movieData?.results) ? movieData.results : []

  function chooseGenre(id) { setSearchParams(id ? { genre: String(id), page: '1' } : {}) }
  function changePage(nextPage) { setSearchParams({ genre: genreId, page: String(nextPage) }) }

  return (
    <div className="page-container genre-page">
      <div className="page-heading"><span className="eyebrow"><span className="eyebrow-dot" /> Browse by mood</span><h1>Explore genres</h1><p>Choose a genre to find your next movie.</p></div>
      {genresState.loading || genresState.error ? <RequestState loading={genresState.loading} error={genresState.error} onRetry={genresState.retry} /> : genres.length ? (
        <nav className="genre-browser" aria-label="Movie genres">
          <button className={`genre-browser-chip${!genreId ? ' is-active' : ''}`} aria-pressed={!genreId} onClick={() => chooseGenre('')}>All genres</button>
          {genres.map((genre) => <button key={genre.id} className={`genre-browser-chip${genreId === String(genre.id) ? ' is-active' : ''}`} aria-pressed={genreId === String(genre.id)} onClick={() => chooseGenre(genre.id)}>{genre.name}</button>)}
        </nav>
      ) : <RequestState empty />}
      {!genreId ? <div className="genre-prompt"><h2>Pick a genre to get started</h2><p>Your selection is saved in the page URL so you can share it.</p></div> : <>
        <div className="section-heading genre-results-heading"><div><h2>{selectedGenre?.name || 'Movies by genre'}</h2><p>{movieData?.total_results ? `${movieData.total_results.toLocaleString()} movies in this selection` : 'Browse matching titles.'}</p></div></div>
        {moviesState.loading || moviesState.error ? <RequestState loading={moviesState.loading} error={moviesState.error} onRetry={moviesState.retry} /> : movies.length ? <MovieGrid movies={movies} /> : <RequestState empty />}
        {!moviesState.loading && !moviesState.error && movies.length > 0 && <nav className="pagination" aria-label="Genre result pages">
          <button className="button-secondary" onClick={() => changePage(page - 1)} disabled={page <= 1}><ArrowBackRoundedIcon /> Previous</button>
          <span>Page {page}{movieData?.total_pages ? ` of ${movieData.total_pages}` : ''}</span>
          <button className="button-secondary" onClick={() => changePage(page + 1)} disabled={page >= Math.min(movieData?.total_pages || 500, 500)}>Next <ArrowForwardRoundedIcon /></button>
        </nav>}
      </>}
    </div>
  )
}

export default GenreBrowsePage
