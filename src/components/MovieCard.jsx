import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Link } from 'react-router-dom'
import MovieImage from './MovieImage.jsx'

function MovieCard({ movie }) {
  const title = movie.title || movie.original_title || 'Untitled movie'
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Year unavailable'

  return (
    <article className="movie-card">
      <Link className="movie-card-link" to={`/movie/${movie.id}`} aria-label={`View details for ${title}`}>
        <div className="movie-poster-wrap">
          <MovieImage path={movie.poster_path} alt={`${title} poster`} className="movie-poster" />
          {Number.isFinite(movie.vote_average) && movie.vote_average > 0 && (
            <span className="poster-rating"><StarRoundedIcon />{movie.vote_average.toFixed(1)}</span>
          )}
        </div>
        <h3 title={title}>{title}</h3>
        <span className="movie-card-year">{year}</span>
      </Link>
    </article>
  )
}

export default MovieCard
