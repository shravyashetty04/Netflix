import { useEffect } from "react";

export default function Modal({ movie, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const headerBg =
    movie.Poster && movie.Poster !== "N/A"
      ? `url(${movie.Poster})`
      : "linear-gradient(135deg, #000, #333)";

  return (
    <div
      className={`modal ${!movie ? "hidden" : ""}`}
      onClick={(e) => {
        if (e.target.classList.contains("modal-backdrop") || e.target.classList.contains("modal")) {
          onClose();
        }
      }}
    >
      <div className="modal-backdrop" />
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundImage: headerBg }}>
            <div className="modal-header-content">
              <h2 className="modal-title">{movie.Title || "Untitled"}</h2>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-meta">
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <span style={{ color: "var(--imdb-yellow)", fontWeight: 600 }}>
                  IMDb {movie.imdbRating}
                </span>
              )}
              {movie.Year && movie.Year !== "N/A" && (
                <span className="muted">{movie.Year}</span>
              )}
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <span className="muted">{movie.Runtime}</span>
              )}
              {movie.Rated && movie.Rated !== "N/A" && (
                <span className="muted">{movie.Rated}</span>
              )}
            </div>
            <p className="modal-description">
              {movie.Plot && movie.Plot !== "N/A"
                ? movie.Plot
                : "No description available."}
            </p>
            <div className="modal-footer">
              <div className="modal-footer-column">
                <div><span className="muted">Genre:</span> {movie.Genre || "-"}</div>
                <div><span className="muted">Director:</span> {movie.Director || "-"}</div>
                <div><span className="muted">Writer:</span> {movie.Writer || "-"}</div>
              </div>
              <div className="modal-footer-column">
                <div><span className="muted">Stars:</span> {movie.Actors || "-"}</div>
                <div><span className="muted">Language:</span> {movie.Language || "-"}</div>
                <div><span className="muted">Awards:</span> {movie.Awards || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
