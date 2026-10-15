import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer" id="credits">
      <div className="footer-inner page-container">
        <Link className="footer-brand" to="/" aria-label="CineVerse home">Cine<span>Verse</span></Link>
        <p className="footer-credit">
          <a className="tmdb-logo-link" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="TMDB, The Movie Database">
            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="TMDB" />
          </a>
          Movie data and images provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
          {' '}This product uses the TMDB API but is not endorsed or certified by TMDB.
          Movie information does not grant rights to stream full movies.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
