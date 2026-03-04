const VideoPlayer = ({ videoUrl, title, onComplete }) => {
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return <div className="video-error">Invalid video URL</div>;
  }

  return (
    <div className="video-player">
      <div className="video-iframe-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <h3 className="video-title">{title}</h3>
    </div>
  );
};

export default VideoPlayer;
