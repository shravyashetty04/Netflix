import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import Modal from "../components/Modal";
import { fetchSearchResults, fetchMovieById } from "../api/omdb";

const FEATURED_SEARCH = "Money Heist";

const ROW_CONFIG = [
  { title: "New this week", search: "extraction" },
  { title: "Trending Now", search: "avengers" },
  { title: "Action & Adventure", search: "mission impossible" },
  { title: "Sci-Fi & Fantasy", search: "star wars" },
  { title: "Drama", search: "godfather" },
  { title: "Comedy", search: "ted" },
];

export default function Movies() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMovie, setModalMovie] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        let items = await fetchSearchResults(FEATURED_SEARCH, "");
        if (!items.length) items = await fetchSearchResults("inception");
        if (items.length) {
          const full = await fetchMovieById(items[0].imdbID);
          setFeaturedMovie(full);
        }
        const results = await Promise.allSettled(
          ROW_CONFIG.map((cfg) => fetchSearchResults(cfg.search))
        );
        const rowData = results.map((r, i) => ({
          title: ROW_CONFIG[i].title,
          movies: r.status === "fulfilled" ? r.value : [],
        }));
        setRows(rowData);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Check your API key and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openDetails = async (imdbID) => {
    try {
      const movie = await fetchMovieById(imdbID);
      setModalMovie(movie);
    } catch (err) {
      console.error(err);
      setModalMovie({ Title: "Unable to load", Plot: "Please try again." });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        <Hero
          movie={featuredMovie}
          onPlay={() => featuredMovie && openDetails(featuredMovie.imdbID)}
          onTrailer={() => featuredMovie && openDetails(featuredMovie.imdbID)}
        />
        <section className="rows">
          {loading && <p className="status">Loading movies…</p>}
          {error && <p className="status">{error}</p>}
          {!loading && !error && rows.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.movies}
              onCardClick={openDetails}
            />
          ))}
        </section>
      </div>
      {modalMovie && (
        <Modal movie={modalMovie} onClose={() => setModalMovie(null)} />
      )}
    </>
  );
}
