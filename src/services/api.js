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

export function getPopularTv({ language = 'en-US', page = 1, signal } = {}) {
  return getData('/tv/popular', { params: { language, page }, signal })
}

export function getTrendingTv({ timeWindow = 'week', language = 'en-US', page = 1, signal } = {}) {
  return getData('/tv/trending', { params: { language, page, time_window: timeWindow }, signal })
}

export function getTvGenres({ language = 'en-US', signal } = {}) {
  return getData('/tv/genres', { params: { language }, signal })
}

export function getTvByGenre(genreId, { language = 'en-US', page = 1, signal } = {}) {
  return getData(`/tv/genre/${encodeURIComponent(genreId)}`, { params: { language, page }, signal })
}

export function searchCatalog(query, { language = 'en-US', signal } = {}) {
  return getData('/tv/search', { params: { query, language }, signal })
}

export function getTvDetails(id, { language = 'en-US', signal } = {}) {
  return getData(`/tv/${encodeURIComponent(id)}`, { params: { language }, signal })
}

export function getPlaybackSource(mediaType, id, { language = 'en-US', signal } = {}) {
  if (!['movie', 'tv'].includes(mediaType) || !/^[1-9]\d{0,9}$/.test(String(id ?? ''))) {
    const error = new Error('A valid movie or TV series ID is required to check for a trailer.')
    error.cineverseMessage = error.message
    return Promise.reject(error)
  }
  return getData(`/playback/${encodeURIComponent(mediaType)}/${encodeURIComponent(id)}`, { params: { language }, signal })
}

export function getApiErrorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    error.cineverseMessage ||
    (error.code === 'ECONNABORTED'
      ? 'The request took too long. Please try again.'
      : 'We could not connect to CineVerse. Check that the backend is running and try again.')
  )
}
