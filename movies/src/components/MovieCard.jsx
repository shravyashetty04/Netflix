const PLACEHOLDER = "https://via.placeholder.com/300x450/181818/666?text=No+Image";

export default function MovieCard({ movie, onClick }) {
  const title = movie.Title || "Untitled";
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER;
  const year = movie.Year && movie.Year !== "N/A" ? movie.Year : "";

  return (
    <article className="card" onClick={() => onClick(movie.imdbID)}>
      <div className="card-img-wrapper">
        <img className="card-img" src={poster} alt={title} loading="lazy" />
        <div className="card-overlay">
          <span className="card-title">{title}</span>
          <span className="card-badge">{year}</span>
        </div>
      </div>
    </article>
  );
}
