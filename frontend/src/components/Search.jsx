import { useState } from "react";
import "./Search.css";

const fetchMoviesByQuery = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&language=en-US&page=1&include_adult=false`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTJlODlhYzM2Njc3ZDMxYWE4ZGQ5ZDQ0ZjdlNGYxMCIsIm5iZiI6MTcyNjU2MjExMi4zMjMwNDMsInN1YiI6IjY2ZGRjZDQxYmI3ZGU5ZjIzNzM4YzM1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NxpgOEY7mXH8jDEsP_wiV0G4dn_VY9-WqJME1_HaXOE",
    },
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results; // Return the list of movies
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setMovies([]); // Clear previous results
    setError(null); // Clear previous errors

    if (query.trim() === "") {
      setError("Please enter a movie title.");
      return;
    }

    try {
      const result = await fetchMoviesByQuery(query);
      if (result.length > 0) {
        setMovies(result);
      } else {
        setError("No movies found.");
      }
    } catch (err) {
      setError("Error fetching movie details.");
    }
  };

  return (
    <>
      <div className="searchSec">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      {movies.length > 0 && (
        <div className="search-results">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.original_title}</h3>
                <p>{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Search;
