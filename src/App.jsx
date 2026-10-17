import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import HomePage from './pages/HomePage.jsx'
import GenreBrowsePage from './pages/GenreBrowsePage.jsx'
import MovieDetailsPage from './pages/MovieDetailsPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import WatchPage from './pages/WatchPage.jsx'
import TvShowsPage from './pages/TvShowsPage.jsx'
import TvDetailsPage from './pages/TvDetailsPage.jsx'
import MoviesPage from './pages/MoviesPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <SiteHeader />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TvShowsPage />} />
            <Route path="/tv/:id" element={<TvDetailsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/genres" element={<GenreBrowsePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/watch/:mediaType/:id" element={<WatchPage />} />
            <Route path="/watch/:id" element={<LegacyMovieWatchRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

function LegacyMovieWatchRedirect() {
  const { id } = useParams()
  return <Navigate to={`/watch/movie/${id}`} replace />
}

function NotFoundPage() {
  return (
    <section className="not-found page-container">
      <span className="eyebrow">Wrong turn</span>
      <h1>We couldn’t find that page.</h1>
      <p>Head back to CineVerse and find something worth watching.</p>
      <Link className="text-link" to="/">Return home</Link>
    </section>
  )
}

export default App
