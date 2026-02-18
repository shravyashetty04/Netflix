const OMDB_API_KEY = "YOUR_OMDB_API_KEY_HERE"; // Replace with your key from http://www.omdbapi.com/apikey.aspx
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const FEATURED_SEARCH_TERM = "inception";

const ROW_CONFIG = [
  { title: "Trending Now", search: "avengers" },
  { title: "Top Rated", search: "dark knight" },
  { title: "Action Movies", search: "mission impossible" },
  { title: "Sci-Fi & Fantasy", search: "star wars" },
  { title: "Drama", search: "godfather" },
  { title: "Family Movies", search: "toy story" },
];

const heroEl = document.getElementById("hero");
const heroTitleEl = document.getElementById("hero-title");
const heroDescriptionEl = document.getElementById("hero-description");
const heroPlayBtn = document.getElementById("hero-play");
const heroMoreBtn = document.getElementById("hero-more");

const rowsContainer = document.getElementById("rows");
const rowTemplate = document.getElementById("row-template");
const cardTemplate = document.getElementById("card-template");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const modalEl = document.getElementById("modal");
const modalCloseBtn = document.getElementById("modal-close");
const modalContentEl = document.getElementById("modal-content");

let featuredMovie = null;

function buildUrl(params) {
  const url = new URL(OMDB_BASE_URL);
  url.search = new URLSearchParams({ apikey: OMDB_API_KEY, ...params }).toString();
  return url.toString();
}

async function fetchJson(params) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "YOUR_OMDB_API_KEY_HERE") {
    throw new Error("Please set your OMDb API key in app.js.");
  }

  const response = await fetch(buildUrl(params));
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Unknown API error");
  }

  return data;
}

async function fetchSearchResults(search) {
  const data = await fetchJson({ s: search, type: "movie" });
  return data.Search || [];
}

async function fetchById(imdbID) {
  return fetchJson({ i: imdbID, plot: "full" });
}

function createRow(title, items) {
  const rowFragment = rowTemplate.content.cloneNode(true);
  const rowSection = rowFragment.querySelector(".row");
  const titleEl = rowFragment.querySelector(".row-title");
  const innerEl = rowFragment.querySelector(".row-inner");

  titleEl.textContent = title;

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "status";
    empty.textContent = "No titles found.";
    innerEl.appendChild(empty);
    return rowSection;
  }

  items.forEach((movie) => {
    const cardFragment = cardTemplate.content.cloneNode(true);
    const cardEl = cardFragment.querySelector(".card");
    const imgEl = cardFragment.querySelector(".card-img");
    const overlayTitleEl = cardFragment.querySelector(".card-title");

    const title = movie.Title || "Untitled";
    overlayTitleEl.textContent = title;

    if (movie.Poster && movie.Poster !== "N/A") {
      imgEl.src = movie.Poster;
      imgEl.alt = title;
    } else {
      imgEl.src =
        "https://via.placeholder.com/300x450/141414/ffffff?text=No+Image";
      imgEl.alt = `${title} poster not available`;
    }

    cardEl.addEventListener("click", () => {
      openDetails(movie.imdbID);
    });

    innerEl.appendChild(cardFragment);
  });

  return rowSection;
}

async function renderRows() {
  rowsContainer.innerHTML = "";

  const loading = document.createElement("p");
  loading.className = "status";
  loading.textContent = "Loading movies…";
  rowsContainer.appendChild(loading);

  try {
    const results = await Promise.allSettled(
      ROW_CONFIG.map((cfg) => fetchSearchResults(cfg.search))
    );

    rowsContainer.innerHTML = "";

    results.forEach((result, idx) => {
      const cfg = ROW_CONFIG[idx];
      const movies = result.status === "fulfilled" ? result.value : [];
      const rowEl = createRow(cfg.title, movies);
      rowsContainer.appendChild(rowEl);
    });
  } catch (err) {
    console.error(err);
    rowsContainer.innerHTML = "";
    const error = document.createElement("p");
    error.className = "status";
    error.textContent =
      "Something went wrong while loading movies. Please try again.";
    rowsContainer.appendChild(error);
  }
}

async function renderHero() {
  try {
    const items = await fetchSearchResults(FEATURED_SEARCH_TERM);
    if (!items.length) {
      throw new Error("No featured movie found");
    }

    const base = items[0];
    const full = await fetchById(base.imdbID);
    featuredMovie = full;

    const title = full.Title || base.Title;
    const year = full.Year || base.Year || "";
    const plot =
      full.Plot && full.Plot !== "N/A"
        ? full.Plot
        : "No plot description available.";

    heroTitleEl.textContent = `${title}${year ? " (" + year + ")" : ""}`;
    heroDescriptionEl.textContent = plot.length > 260 ? plot.slice(0, 260) + "…" : plot;

    if (full.Poster && full.Poster !== "N/A") {
      heroEl.style.backgroundImage = `url(${full.Poster})`;
    } else {
      heroEl.style.backgroundImage =
        "linear-gradient(120deg, #000000, #141414, #000000)";
    }

    const metaRow = document.createElement("div");
    metaRow.className = "hero-meta";
    metaRow.innerHTML = `
      <span class="hero-meta-rating">${
        full.imdbRating && full.imdbRating !== "N/A"
          ? `${full.imdbRating} IMDb`
          : ""
      }</span>
      <span class="hero-meta-dot muted">${
        full.Runtime && full.Runtime !== "N/A" ? full.Runtime : ""
      }</span>
      <span class="badge">Movie</span>
    `;
    heroDescriptionEl.insertAdjacentElement("beforebegin", metaRow);
  } catch (err) {
    console.error(err);
    heroTitleEl.textContent = "Unable to load featured movie";
    heroDescriptionEl.textContent =
      "Check your OMDb API key and network connection, then reload the page.";
  }
}

function openModal(contentEl) {
  modalContentEl.innerHTML = "";
  modalContentEl.appendChild(contentEl);
  modalEl.classList.remove("hidden");
}

function closeModal() {
  modalEl.classList.add("hidden");
}

async function openDetails(imdbID) {
  try {
    const movie = await fetchById(imdbID);

    const root = document.createElement("div");

    const header = document.createElement("div");
    header.className = "modal-header";
    if (movie.Poster && movie.Poster !== "N/A") {
      header.style.backgroundImage = `url(${movie.Poster})`;
    } else {
      header.style.backgroundImage =
        "linear-gradient(135deg, #000000, #434343)";
    }

    const headerContent = document.createElement("div");
    headerContent.className = "modal-header-content";
    headerContent.innerHTML = `
      <div class="badge">Movie Detail</div>
      <h2 class="modal-title">${movie.Title || "Untitled"}</h2>
    `;
    header.appendChild(headerContent);

    const body = document.createElement("div");
    body.className = "modal-body";

    const meta = document.createElement("div");
    meta.className = "modal-meta";
    meta.innerHTML = `
      ${
        movie.imdbRating && movie.imdbRating !== "N/A"
          ? `<span class="hero-meta-rating">${movie.imdbRating} IMDb</span>`
          : ""
      }
      ${
        movie.Year && movie.Year !== "N/A"
          ? `<span class="muted">${movie.Year}</span>`
          : ""
      }
      ${
        movie.Runtime && movie.Runtime !== "N/A"
          ? `<span class="muted">${movie.Runtime}</span>`
          : ""
      }
      ${
        movie.Rated && movie.Rated !== "N/A"
          ? `<span class="pill">${movie.Rated}</span>`
          : ""
      }
    `;

    const description = document.createElement("p");
    description.className = "modal-description";
    description.textContent =
      movie.Plot && movie.Plot !== "N/A"
        ? movie.Plot
        : "No description available.";

    const footer = document.createElement("div");
    footer.className = "modal-footer";
    footer.innerHTML = `
      <div class="modal-footer-column">
        <div><span class="muted">Genre:</span> ${movie.Genre || "-"}</div>
        <div><span class="muted">Director:</span> ${movie.Director || "-"}</div>
        <div><span class="muted">Writer:</span> ${movie.Writer || "-"}</div>
      </div>
      <div class="modal-footer-column">
        <div><span class="muted">Stars:</span> ${movie.Actors || "-"}</div>
        <div><span class="muted">Language:</span> ${movie.Language || "-"}</div>
        <div><span class="muted">Awards:</span> ${movie.Awards || "-"}</div>
      </div>
    `;

    body.appendChild(meta);
    body.appendChild(description);
    body.appendChild(footer);

    root.appendChild(header);
    root.appendChild(body);

    openModal(root);
  } catch (err) {
    console.error(err);
    const fallback = document.createElement("div");
    fallback.className = "modal-body";
    fallback.innerHTML = `
      <h2 class="modal-title">Unable to load details</h2>
      <p class="modal-description">Please try again in a moment.</p>
    `;
    openModal(fallback);
  }
}

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  rowsContainer.innerHTML = "";

  const loading = document.createElement("p");
  loading.className = "status";
  loading.textContent = `Searching for “${query}”…`;
  rowsContainer.appendChild(loading);

  try {
    const movies = await fetchSearchResults(query);
    rowsContainer.innerHTML = "";
    const row = createRow(`Search results for “${query}”`, movies);
    rowsContainer.appendChild(row);
  } catch (err) {
    console.error(err);
    rowsContainer.innerHTML = "";
    const error = document.createElement("p");
    error.className = "status";
    error.textContent =
      "There was a problem searching. Check your API key and try again.";
    rowsContainer.appendChild(error);
  }
}

function initEvents() {
  searchForm.addEventListener("submit", handleSearch);

  heroPlayBtn.addEventListener("click", () => {
    if (featuredMovie && featuredMovie.imdbID) {
      openDetails(featuredMovie.imdbID);
    }
  });

  heroMoreBtn.addEventListener("click", () => {
    if (featuredMovie && featuredMovie.imdbID) {
      openDetails(featuredMovie.imdbID);
    }
  });

  modalCloseBtn.addEventListener("click", closeModal);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl || e.target === modalEl.querySelector(".modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalEl.classList.contains("hidden")) {
      closeModal();
    }
  });
}

async function init() {
  initEvents();
  await renderHero();
  await renderRows();
}

init().catch((err) => {
  console.error(err);
});

