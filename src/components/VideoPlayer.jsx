import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import { useEffect, useRef, useState } from 'react'

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function VideoPlayer({ source }) {
  const playerRef = useRef(null)
  const videoRef = useRef(null)
  const readinessTimerRef = useRef(null)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ currentTime: 0, duration: 0, volume: 1, muted: false, paused: true, loading: true, buffering: false, error: false, errorMessage: '' })
  const [fullscreen, setFullscreen] = useState(false)
  const [controlError, setControlError] = useState('')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    const clearReadinessTimer = () => {
      if (readinessTimerRef.current) {
        window.clearTimeout(readinessTimerRef.current)
        readinessTimerRef.current = null
      }
    }
    const failIfStillWaiting = (message) => {
      if (readinessTimerRef.current) return
      readinessTimerRef.current = window.setTimeout(() => {
        readinessTimerRef.current = null
        setState((previous) => ({
          ...previous,
          loading: false,
          buffering: false,
          error: true,
          errorMessage: message,
        }))
      }, 15000)
    }
    const update = () => setState((previous) => ({
      ...previous,
      currentTime: video.currentTime || 0,
      duration: Number.isFinite(video.duration) ? video.duration : 0,
      volume: video.volume,
      muted: video.muted,
      paused: video.paused,
    }))
    const onLoadStart = () => {
      setState((previous) => ({ ...previous, loading: true, buffering: false, error: false, errorMessage: '' }))
      failIfStillWaiting('The video did not become ready after 15 seconds. Check your connection and retry.')
    }
    const onLoadedMetadata = () => {
      update()
      failIfStillWaiting('The video metadata loaded, but playback did not become ready. Please retry.')
    }
    const onCanPlay = () => {
      clearReadinessTimer()
      setState((previous) => ({ ...previous, loading: false, buffering: false, error: false, errorMessage: '' }))
    }
    const onWaiting = () => {
      setState((previous) => ({ ...previous, loading: false, buffering: true }))
      failIfStillWaiting('The video stopped loading for 15 seconds. Check your connection and retry.')
    }
    const onStalled = () => {
      setState((previous) => ({ ...previous, loading: false, buffering: true }))
      failIfStillWaiting('The video source stopped responding. Check your connection and retry.')
    }
    const onPlaying = () => {
      clearReadinessTimer()
      setState((previous) => ({ ...previous, loading: false, buffering: false, paused: false, error: false, errorMessage: '' }))
    }
    const onError = () => {
      clearReadinessTimer()
      const mediaError = video.error
      const message = mediaError?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
        ? 'This video format or source is not supported by your browser.'
        : 'The video source could not be loaded. Check your connection and retry.'
      setState((previous) => ({ ...previous, loading: false, buffering: false, error: true, errorMessage: message }))
    }
    const handlers = {
      loadstart: onLoadStart,
      loadedmetadata: onLoadedMetadata,
      durationchange: update,
      timeupdate: update,
      volumechange: update,
      play: update,
      pause: update,
      canplay: onCanPlay,
      waiting: onWaiting,
      stalled: onStalled,
      playing: onPlaying,
      error: onError,
    }
    Object.entries(handlers).forEach(([event, handler]) => video.addEventListener(event, handler))
    return () => {
      clearReadinessTimer()
      Object.entries(handlers).forEach(([event, handler]) => video.removeEventListener(event, handler))
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [source.url, attempt])

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === playerRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    setControlError('')
    if (video.paused) {
      try { await video.play() } catch { setControlError('Playback could not start. Use the retry control to load the clip again.') }
    } else video.pause()
  }

  async function toggleFullscreen() {
    setControlError('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await playerRef.current?.requestFullscreen()
    } catch {
      setControlError('Fullscreen is not available in this browser.')
    }
  }

  function setVolume(value) {
    const video = videoRef.current
    if (!video) return
    video.volume = Number(value)
    video.muted = Number(value) === 0
  }

  function retryPlayback() {
    setControlError('')
    setState({ currentTime: 0, duration: 0, volume: 1, muted: false, paused: true, loading: true, buffering: false, error: false, errorMessage: '' })
    setAttempt((value) => value + 1)
  }

  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0

  return (
    <section className="video-player" ref={playerRef} aria-label={`Video player: ${source.title}`}>
      <div className="video-player-screen">
        <video key={`${source.url}:${attempt}`} ref={videoRef} className="video-player-media" src={source.url} preload="metadata" playsInline aria-label={source.title} />
        {(state.loading || state.buffering) && <div className="video-player-status" role="status">{state.buffering ? 'Buffering…' : 'Loading demo clip…'}</div>}
        {state.error && <div className="video-player-error" role="alert"><p>{state.errorMessage || 'We couldn’t load this video.'}</p><button className="player-retry" type="button" onClick={retryPlayback}><ReplayRoundedIcon /> Retry</button></div>}
      </div>
      <div className="video-player-controls">
        <div className="player-timeline">
          <input aria-label="Seek video" type="range" min="0" max={state.duration || 0} step="0.1" value={Math.min(state.currentTime, state.duration || 0)} style={{ '--player-progress': `${progress}%` }} onChange={(event) => { if (videoRef.current) videoRef.current.currentTime = Number(event.target.value) }} disabled={!state.duration || state.error} />
        </div>
        <div className="player-control-row">
          <div className="player-control-group">
            <button type="button" className="player-icon-button" aria-label={state.paused ? 'Play video' : 'Pause video'} onClick={togglePlayback} disabled={state.error}>{state.paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}</button>
            <button type="button" className="player-icon-button" aria-label={state.muted || state.volume === 0 ? 'Unmute video' : 'Mute video'} aria-pressed={state.muted || state.volume === 0} onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted }}>{state.muted || state.volume === 0 ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}</button>
            <input className="player-volume" aria-label="Video volume" type="range" min="0" max="1" step="0.05" value={state.muted ? 0 : state.volume} onChange={(event) => setVolume(event.target.value)} />
            <span className="player-time" aria-live="off">{formatTime(state.currentTime)} / {formatTime(state.duration)}</span>
          </div>
          <button type="button" className="player-icon-button" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={fullscreen} onClick={toggleFullscreen}>{fullscreen ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />}</button>
        </div>
        {controlError && <p className="player-control-error" role="alert">{controlError}</p>}
      </div>
    </section>
  )
}

export default VideoPlayer
