const YOUTUBE_KEY_PATTERN = /^[A-Za-z0-9_-]{6,20}$/

export function validatePlaybackSource(data) {
  const source = data?.source
  if (!data?.available || source?.kind !== 'trailer' || source.provider !== 'YouTube') return null
  if (typeof source.key !== 'string' || !YOUTUBE_KEY_PATTERN.test(source.key)) return null
  return {
    ...source,
    embedUrl: `https://www.youtube-nocookie.com/embed/${source.key}?controls=1&rel=0&playsinline=1`,
  }
}
