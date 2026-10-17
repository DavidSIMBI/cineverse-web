import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import useWatchlist from '../context/useWatchlist.js'

function WatchlistButton({ item, mediaType, compact = false }) {
  const type = mediaType || item.media_type || (item.name || item.original_name ? 'tv' : 'movie')
  const { addItem, removeItem, isSaved } = useWatchlist()
  const saved = isSaved(item.id, type)
  const label = saved ? 'Remove from Watchlist' : 'Add to Watchlist'
  return <button className={`watchlist-button${compact ? ' watchlist-button--compact' : ''}${saved ? ' is-saved' : ''}`} type="button" aria-label={`${label}: ${item.title || item.name || 'title'}`} aria-pressed={saved} onClick={() => saved ? removeItem(item.id, type) : addItem(item, type)}>
    {saved ? <BookmarkAddedRoundedIcon /> : <BookmarkAddOutlinedIcon />}{!compact && <span>{saved ? 'In Watchlist' : 'Add to Watchlist'}</span>}
  </button>
}

export default WatchlistButton
