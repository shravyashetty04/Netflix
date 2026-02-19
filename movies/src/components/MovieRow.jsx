import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies, onCardClick }) {
  const scrollerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: direction * 400, behavior: "smooth" });
    }
  };

  return (
    <section className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroller" ref={scrollerRef}>
        <button
          className="row-arrow row-arrow-left"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div className="row-inner">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} onClick={onCardClick} />
          ))}
        </div>
        <button
          className="row-arrow row-arrow-right"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
