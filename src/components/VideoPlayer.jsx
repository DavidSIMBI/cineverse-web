function VideoPlayer({ source }) {
  return <section className="video-player" aria-label={`YouTube trailer: ${source.title}`}>
    <div className="video-player-screen">
      <iframe
        className="video-player-media"
        src={source.embedUrl}
        title={source.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  </section>
}

export default VideoPlayer
