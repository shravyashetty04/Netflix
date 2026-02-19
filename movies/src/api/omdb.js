const OMDB_API_KEY = "a15e611f";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

function buildUrl(params) {
  const url = new URL(OMDB_BASE_URL);
  url.search = new URLSearchParams({ apikey: OMDB_API_KEY, ...params }).toString();
  return url.toString();
}

export async function fetchJson(params) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "YOUR_OMDB_API_KEY_HERE") {
    throw new Error("Please set your OMDb API key in src/api/omdb.js");
  }
  const response = await fetch(buildUrl(params));
  if (!response.ok) throw new Error(`Network error: ${response.status}`);
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.Error || "Unknown API error");
  return data;
}

export async function fetchSearchResults(search, type = "movie") {
  const data = await fetchJson({ s: search, type });
  return data.Search || [];
}

export async function fetchMovieById(imdbID) {
  return fetchJson({ i: imdbID, plot: "full" });
}
