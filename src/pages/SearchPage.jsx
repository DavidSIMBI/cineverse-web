import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid.jsx'
import RequestState from '../components/RequestState.jsx'
import { getApiErrorMessage, searchMovies } from '../services/api.js'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('query') || '').trim()
  const [response, setResponse] = useState({ key: '', movies: [], error: '' })
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${query}:${attempt}`

  useEffect(() => {
    if (!query) return undefined
    const controller = new AbortController()
    searchMovies(query, { signal: controller.signal })
      .then((data) => setResponse({ key: requestKey, movies: data.results || [], error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) setResponse({ key: requestKey, movies: [], error: getApiErrorMessage(requestError) })
      })
    return () => controller.abort()
  }, [query, attempt, requestKey])

  const currentResponse = response.key === requestKey
  const movies = currentResponse ? response.movies : []
  const error = currentResponse ? response.error : ''
  const loading = Boolean(query) && !currentResponse

  return (
    <section className="page-container search-page">
      <div className="page-heading">
        <span className="eyebrow"><span className="eyebrow-dot" /> Find your next favourite</span>
        <h1>Search movies</h1>
        <p>Explore movie details from across the TMDB catalogue.</p>
      </div>
      {!query ? (
        <div className="state-panel"><SearchRoundedIcon className="state-icon" /><h2>What are you in the mood for?</h2><p>Enter a movie title in the search bar above to see matching films.</p></div>
      ) : (
        <>
          <p className="search-summary">Results for <strong>“{query}”</strong></p>
          {loading || error ? (
            <RequestState loading={loading} error={error} onRetry={() => setAttempt((value) => value + 1)} />
          ) : movies.length ? (
            <MovieGrid movies={movies} />
          ) : (
            <RequestState empty />
          )}
        </>
      )}
    </section>
  )
}

export default SearchPage
