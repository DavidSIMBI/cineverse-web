import ApiError from './api-error.js'

const DEFAULT_LANGUAGE = 'en-US'
const LANGUAGE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/

export function getLanguage(request) {
  const language = request.query.language ?? DEFAULT_LANGUAGE
  if (typeof language !== 'string' || !LANGUAGE_PATTERN.test(language)) {
    throw new ApiError(400, 'INVALID_LANGUAGE', 'Language must be a valid language code such as en-US.')
  }
  return language
}

export function getPage(request) {
  const value = request.query.page ?? '1'
  if (typeof value !== 'string' || !/^[1-9]\d{0,2}$/.test(value) || Number(value) > 500) {
    throw new ApiError(400, 'INVALID_PAGE', 'Page must be a whole number between 1 and 500.')
  }
  return Number(value)
}

export function getPositiveId(value, code = 'INVALID_MOVIE_ID', label = 'Movie ID') {
  if (!/^[1-9]\d{0,9}$/.test(value) || Number(value) > 2_147_483_647) {
    throw new ApiError(400, code, `${label} must be a positive integer.`)
  }
  return Number(value)
}
