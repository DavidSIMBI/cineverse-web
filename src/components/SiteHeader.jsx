import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'

function SiteHeader() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get('query') || ''
  const [draft, setDraft] = useState({ query: null, value: '' })
  const query = draft.query === currentQuery ? draft.value : currentQuery

  function submitSearch(event) {
    event.preventDefault()
    const cleanedQuery = query.trim()
    navigate(cleanedQuery ? `/search?query=${encodeURIComponent(cleanedQuery)}` : '/search')
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="CineVerse home">
        <span className="brand-mark">CV</span>
        <span className="brand-name">Cine<span>Verse</span></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" end>Discover</NavLink>
        <NavLink to="/search">Search</NavLink>
      </nav>
      <form className="header-search" role="search" onSubmit={submitSearch}>
        <button type="submit" aria-label="Search movies"><SearchRoundedIcon fontSize="small" /></button>
        <input aria-label="Search movie titles" placeholder="Search films, people..." value={query} onChange={(event) => setDraft({ query: currentQuery, value: event.target.value })} />
      </form>
    </header>
  )
}

export default SiteHeader
