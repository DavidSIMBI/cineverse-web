import { getMovieVideos, getTvVideos } from './tmdb.service.js'

const YOUTUBE_KEY_PATTERN = /^[A-Za-z0-9_-]{6,20}$/

function languageRank(video, language) {
  const requested = language.toLowerCase().split('-')[0]
  if (video.iso_639_1?.toLowerCase() === requested) return 2
  if (video.iso_639_1?.toLowerCase() === 'en') return 1
  return 0
}

function selectTrailer(videos, language, mediaType) {
  const candidates = (videos || []).filter((video) =>
    video.site === 'YouTube' && video.type === 'Trailer' && YOUTUBE_KEY_PATTERN.test(video.key || ''),
  )
  candidates.sort((a, b) => Number(Boolean(b.official)) - Number(Boolean(a.official)) || languageRank(b, language) - languageRank(a, language) || (b.published_at || '').localeCompare(a.published_at || ''))
  const trailer = candidates[0]
  if (!trailer) return { available: false, reason: 'NO_TRAILER' }
  return {
    available: true,
    source: {
      kind: 'trailer',
      provider: 'YouTube',
      key: trailer.key,
      title: trailer.name || `${mediaType === 'tv' ? 'TV series' : 'Movie'} trailer`,
      official: Boolean(trailer.official),
      language: trailer.iso_639_1 || null,
    },
  }
}

export async function getPlaybackSource(mediaType, id, language) {
  const response = mediaType === 'tv'
    ? await getTvVideos(id, language)
    : await getMovieVideos(id, language)
  return selectTrailer(response?.results, language, mediaType)
}
