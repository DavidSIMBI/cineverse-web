import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Link } from 'react-router-dom'
import MovieImage from './MovieImage.jsx'
import WatchlistButton from './WatchlistButton.jsx'

function MovieCard({ movie }) {
  const isTv = movie.media_type === 'tv' || movie.name || movie.original_name
  const title = movie.title || movie.name || movie.original_title || movie.original_name || 'Untitled title'
  const date = movie.release_date || movie.first_air_date
  const year = date ? date.slice(0, 4) : 'Year unavailable'

  return (
    <article className="movie-card">
      <div className="movie-card-artwork">
      <Link className="movie-card-link" to={`/${isTv ? 'tv' : 'movie'}/${movie.id}`} aria-label={`View ${isTv ? 'TV series' : 'movie'} details for ${title}`}>
        <div className="movie-poster-wrap">
          <MovieImage path={movie.poster_path} alt={`${title} poster`} className="movie-poster" />
          {Number.isFinite(movie.vote_average) && movie.vote_average > 0 && (
            <span className="poster-rating"><StarRoundedIcon />{movie.vote_average.toFixed(1)}</span>
          )}
        </div>
      </Link>
      <WatchlistButton item={movie} mediaType={isTv ? 'tv' : 'movie'} compact />
      <Link className="movie-card-link" to={`/${isTv ? 'tv' : 'movie'}/${movie.id}`} aria-label={`View details for ${title}`}>
        {movie.media_type && <span className="result-type">{isTv ? 'TV Series' : 'Movie'}</span>}
        <h3 title={title}>{title}</h3>
        <span className="movie-card-year">{year}</span>
      </Link>
      </div>
    </article>
  )
}

export default MovieCard
