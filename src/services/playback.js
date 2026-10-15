const AUTHORIZED_DEMO_ORIGIN = 'https://interactive-examples.mdn.mozilla.net'
const AUTHORIZED_DEMO_PATH = '/media/cc0-videos/flower.mp4'

export function validatePlaybackSource(data) {
  if (!data?.available || !data.source) return null

  const { source } = data
  let url
  try {
    url = new URL(source.url)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' || url.username || url.password || url.hash) return null
  if (!['demo', 'trailer', 'movie'].includes(source.kind)) return null
  if (!['video/mp4', 'video/webm', 'application/vnd.apple.mpegurl'].includes(source.type)) return null
  if (source.kind === 'demo' && (url.origin !== AUTHORIZED_DEMO_ORIGIN || url.pathname !== AUTHORIZED_DEMO_PATH || url.search)) return null
  if (![source.title, source.license, source.attribution, source.description].every((value) => typeof value === 'string' && value.trim())) return null
  return source
}
