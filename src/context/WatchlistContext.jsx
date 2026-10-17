import { useCallback, useEffect, useMemo, useState } from 'react'
import WatchlistContext from './watchlist-context.js'

const STORAGE_KEY = 'cineverse-watchlist'

function readWatchlist() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set()
    return parsed.filter((item) => {
      if (!item || !['movie', 'tv'].includes(item.media_type) || !/^[1-9]\d*$/.test(String(item.id))) return false
      const key = `${item.media_type}:${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } catch {
    return []
  }
}

function toWatchlistItem(item, mediaType) {
  const type = mediaType || item.media_type || (item.name || item.original_name ? 'tv' : 'movie')
  const id = String(item.id)
  return {
    id,
    media_type: type,
    title: item.title || item.name || item.original_title || item.original_name || 'Untitled title',
    overview: item.overview || '',
    poster_path: item.poster_path || null,
    backdrop_path: item.backdrop_path || null,
    vote_average: Number(item.vote_average) || 0,
    release_date: item.release_date || null,
    first_air_date: item.first_air_date || null,
  }
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(readWatchlist)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Keep the in-memory watchlist usable if browser storage is unavailable.
    }
  }, [items])

  const addItem = useCallback((item, mediaType) => {
    const normalized = toWatchlistItem(item, mediaType)
    if (!['movie', 'tv'].includes(normalized.media_type) || !/^[1-9]\d*$/.test(normalized.id)) return
    setItems((current) => current.some((saved) => saved.media_type === normalized.media_type && saved.id === normalized.id)
      ? current
      : [normalized, ...current])
  }, [])
  const removeItem = useCallback((id, mediaType) => {
    setItems((current) => current.filter((item) => !(item.id === String(id) && item.media_type === mediaType)))
  }, [])
  const isSaved = useCallback((id, mediaType) => items.some((item) => item.id === String(id) && item.media_type === mediaType), [items])
  const value = useMemo(() => ({ items, addItem, removeItem, isSaved }), [items, addItem, removeItem, isSaved])
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}
