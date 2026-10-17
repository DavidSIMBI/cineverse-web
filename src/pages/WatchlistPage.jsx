import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid.jsx'
import useWatchlist from '../context/useWatchlist.js'

function WatchlistPage() {
  const { items } = useWatchlist()
  return <section className="page-container genre-page watchlist-page">
    <div className="page-heading"><span className="eyebrow"><span className="eyebrow-dot" /> Your saved titles</span><h1>My Watchlist</h1><p>Movies and TV series you want to come back to.</p></div>
    {items.length ? <MovieGrid movies={items} /> : <div className="state-panel watchlist-empty"><BookmarkBorderRoundedIcon className="state-icon" /><h2>Your watchlist is empty</h2><p>Save movies and series with the bookmark button and they’ll be collected here.</p><div className="watchlist-empty-links"><Link className="button-secondary" to="/movies">Discover movies</Link><Link className="button-secondary" to="/tv">Explore TV shows</Link></div></div>}
  </section>
}

export default WatchlistPage
