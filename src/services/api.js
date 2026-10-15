import axios from 'axios'

const apiClient = axios.create({ baseURL: '/api', timeout: 15_000 })

async function getData(path, config = {}) {
  const response = await apiClient.get(path, config)
  return response.data.data
}

export function getPopularMovies({ language = 'en-US', signal } = {}) {
  return getData('/movies/popular', { params: { language }, signal })
}

function getMovieList(path, { language = 'en-US', page = 1, signal } = {}) {
  return getData(path, { params: { language, page }, signal })
}

export function getTrendingMovies({ timeWindow = 'week', language = 'en-US', page = 1, signal } = {}) {
  return getData('/movies/trending', { params: { language, page, time_window: timeWindow }, signal })
}

export function getTopRatedMovies(options = {}) { return getMovieList('/movies/top-rated', options) }
export function getUpcomingMovies(options = {}) { return getMovieList('/movies/upcoming', options) }

export function getGenres({ language = 'en-US', signal } = {}) {
  return getData('/genres', { params: { language }, signal })
}

export function getMoviesByGenre(genreId, { language = 'en-US', page = 1, signal } = {}) {
  return getMovieList(`/movies/genre/${encodeURIComponent(genreId)}`, { language, page, signal })
}

export function getSimilarMovies(id, { language = 'en-US', page = 1, signal } = {}) {
  return getMovieList(`/movies/${encodeURIComponent(id)}/similar`, { language, page, signal })
}

export function searchMovies(query, { language = 'en-US', signal } = {}) {
  return getData('/movies/search', { params: { query, language }, signal })
}

export function getMovieDetails(id, { language = 'en-US', signal } = {}) {
  return getData(`/movies/${encodeURIComponent(id)}`, { params: { language }, signal })
}

export function getApiErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    (error.code === 'ECONNABORTED'
      ? 'The request took too long. Please try again.'
      : 'We could not connect to CineVerse. Check that the backend is running and try again.')
  )
}
