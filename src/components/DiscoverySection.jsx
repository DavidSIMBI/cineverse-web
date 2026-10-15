import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Link } from 'react-router-dom'
import MovieRail from './MovieRail.jsx'
import RequestState from './RequestState.jsx'

function DiscoverySection({ id, title, description, movies = [], loading, error, onRetry, link }) {
  return (
    <section className="page-container section-block" aria-labelledby={`${id}-heading`}>
      <div className="section-heading">
        <div><h2 id={`${id}-heading`}>{title}</h2><p>{description}</p></div>
        {link && <Link className="section-link" to={link.to}>{link.label} <ArrowForwardRoundedIcon fontSize="small" /></Link>}
      </div>
      {loading || error ? <RequestState loading={loading} error={error} onRetry={onRetry} /> : movies.length ? <MovieRail movies={movies} label={title} /> : <RequestState empty />}
    </section>
  )
}

export default DiscoverySection
