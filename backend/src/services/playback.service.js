import ApiError from '../utils/api-error.js'

const AUTHORIZED_DEMO_HOST = 'interactive-examples.mdn.mozilla.net'
const PLAYBACK_SOURCES = new Map([
  ['550', {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    type: 'video/mp4',
    kind: 'demo',
    title: 'Flower sample video',
    license: 'CC0 1.0',
    attribution: 'MDN sample media',
    description: 'A short public-domain sample used to demonstrate the CineVerse player. It is not the movie listed on this page.',
  }],
])

function validateSource(source) {
  let url
  try {
    url = new URL(source.url)
  } catch {
    return false
  }

  const safeUrl = url.protocol === 'https:' && !url.username && !url.password && !url.hash
  const supportedType = ['video/mp4', 'video/webm'].includes(source.type)
  const supportedKind = ['demo', 'trailer', 'movie'].includes(source.kind)
  const validDemo = source.kind !== 'demo' || (
    url.origin === `https://${AUTHORIZED_DEMO_HOST}` &&
    url.pathname === '/media/cc0-videos/flower.mp4' &&
    !url.search &&
    source.type === 'video/mp4'
  )

  return safeUrl && supportedType && supportedKind && validDemo &&
    [source.title, source.license, source.attribution, source.description]
      .every((value) => typeof value === 'string' && value.trim().length > 0)
}

export function getPlaybackSource(movieId) {
  const source = PLAYBACK_SOURCES.get(String(movieId))
  if (!source) return { available: false, kind: 'unavailable' }

  if (!validateSource(source)) {
    throw new ApiError(500, 'INVALID_PLAYBACK_SOURCE', 'The configured playback source is invalid.')
  }

  return { available: true, source: { ...source } }
}
