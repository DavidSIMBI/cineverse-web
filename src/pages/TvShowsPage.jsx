import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid.jsx'
import RequestState from '../components/RequestState.jsx'
import useApiResource from '../hooks/useApiResource.js'
import { getPopularTv, getTvByGenre, getTvGenres } from '../services/api.js'

function TvShowsPage() {
  const [params, setParams] = useSearchParams()
  const rawGenre = params.get('genre') || ''
  const genreId = /^[1-9]\d{0,9}$/.test(rawGenre) ? rawGenre : ''
  const pageRaw = params.get('page') || '1'
  const page = /^[1-9]\d{0,2}$/.test(pageRaw) && Number(pageRaw) <= 500 ? Number(pageRaw) : 1
  const loadGenres = useCallback((signal) => getTvGenres({ signal }), [])
  const loadShows = useCallback((signal) => (genreId ? getTvByGenre(genreId, { page, signal }) : getPopularTv({ page, signal })), [genreId, page])
  const genres = useApiResource('tv-genres', loadGenres)
  const showsState = useApiResource(`tv-list:${genreId}:${page}`, loadShows)
  const shows = (showsState.data?.results || []).map((show) => ({ ...show, media_type: 'tv' }))
  const genreList = genres.data?.genres || []
  const selected = genreList.find((item) => String(item.id) === genreId)

  function chooseGenre(id) { setParams(id ? { genre: String(id), page: '1' } : {}) }

  return <section className="page-container genre-page">
    <div className="page-heading"><span className="eyebrow"><span className="eyebrow-dot" /> Series discovery</span><h1>TV Shows</h1><p>Popular series and shows by genre, powered by TMDB.</p></div>
    {genres.loading || genres.error ? <RequestState loading={genres.loading} error={genres.error} onRetry={genres.retry} /> : <nav className="genre-browser" aria-label="TV genres">
      <button className={`genre-browser-chip${!genreId ? ' is-active' : ''}`} aria-pressed={!genreId} onClick={() => chooseGenre('')}>Popular</button>
      {genreList.map((genre) => <button key={genre.id} className={`genre-browser-chip${genreId === String(genre.id) ? ' is-active' : ''}`} aria-pressed={genreId === String(genre.id)} onClick={() => chooseGenre(genre.id)}>{genre.name}</button>)}
    </nav>}
    <div className="section-heading genre-results-heading"><div><h2>{selected?.name || 'Popular TV Shows'}</h2><p>Explore series from across the catalogue.</p></div></div>
    {showsState.loading || showsState.error ? <RequestState loading={showsState.loading} error={showsState.error} onRetry={showsState.retry} /> : shows.length ? <MovieGrid movies={shows} /> : <RequestState empty />}
    {!showsState.loading && !showsState.error && shows.length > 0 && <nav className="pagination" aria-label="TV result pages"><button className="button-secondary" disabled={page <= 1} onClick={() => setParams({ ...(genreId ? { genre: genreId } : {}), page: String(page - 1) })}>Previous</button><span>Page {page}{showsState.data?.total_pages ? ` of ${showsState.data.total_pages}` : ''}</span><button className="button-secondary" disabled={page >= Math.min(showsState.data?.total_pages || 500, 500)} onClick={() => setParams({ ...(genreId ? { genre: genreId } : {}), page: String(page + 1) })}>Next</button></nav>}
  </section>
}

export default TvShowsPage
