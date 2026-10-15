import MovieCard from './MovieCard.jsx'

function MovieRail({ movies, label }) {
  return (
    <div className="movie-rail" role="list" aria-label={label}>
      {movies.map((movie) => <div role="listitem" className="movie-rail-item" key={movie.id}><MovieCard movie={movie} /></div>)}
    </div>
  )
}

export default MovieRail
