function splitTitleForNetflixStyle(title) {
  if (!title || typeof title !== "string") return { main: "Movie", accent: "" };
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return { main: title.toUpperCase(), accent: "" };
  const lastWord = words.pop();
  const main = words.join(" ").toUpperCase() + " ";
  const accent = lastWord.toUpperCase();
  return { main, accent };
}

export default function Hero({ movie, onPlay, onTrailer }) {
  if (!movie) {
    return (
      <section className="hero" style={{ backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-topline">N SERIES</p>
          <h1 className="hero-title">
            <span>Loading…</span>
          </h1>
        </div>
      </section>
    );
  }

  const title = movie.Title || "Untitled";
  const { main, accent } = splitTitleForNetflixStyle(title);
  const subtitle =
    movie.Type === "series"
      ? `${movie.totalSeasons || "?"} Season${(movie.totalSeasons || 1) > 1 ? "s" : ""}`
      : movie.Year && movie.Year !== "N/A"
      ? movie.Year
      : "";
  const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "-";
  const extra = movie.Rated && movie.Rated !== "N/A" ? `${movie.Rated} Streams` : "";
  const bgImage =
    movie.Poster && movie.Poster !== "N/A"
      ? `url(${movie.Poster})`
      : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)";

  return (
    <section className="hero" style={{ backgroundImage: bgImage }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-topline">N SERIES</p>
        <h1 className="hero-title">
          <span>{main}</span>
          {accent && <span className="hero-title-accent">{accent}</span>}
        </h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        <div className="hero-meta">
          <span className="hero-imdb">
            <span className="imdb-badge">IMDb</span>
            <span>{rating}</span>
          </span>
          {extra && <span className="hero-extra">{extra}</span>}
        </div>
        <div className="hero-actions">
          <button className="btn btn-play" onClick={onPlay}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button className="btn btn-trailer" onClick={onTrailer}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Trailer
          </button>
        </div>
      </div>
    </section>
  );
}
