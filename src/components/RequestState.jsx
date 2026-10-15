import MovieCreationRoundedIcon from '@mui/icons-material/MovieCreationRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

function RequestState({ loading = false, error = '', empty = false, onRetry }) {
  if (loading) {
    return <div className="state-panel" role="status" aria-live="polite"><CircularProgress size={30} /><p>Finding your next favourite…</p></div>
  }

  if (error) {
    return (
      <div className="state-panel" role="alert">
        <MovieCreationRoundedIcon className="state-icon" />
        <h2>We hit a small snag.</h2>
        <p>{error}</p>
        {onRetry && <Button className="retry-button" onClick={onRetry} startIcon={<RefreshRoundedIcon />}>Try again</Button>}
      </div>
    )
  }

  if (empty) {
    return <div className="state-panel"><MovieCreationRoundedIcon className="state-icon" /><h2>No movies found</h2><p>Try another title or check the spelling and search again.</p></div>
  }

  return null
}

export default RequestState
