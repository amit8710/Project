// MovieCard.js
import React from "react";
import "./MovieCard.css"; // Style your MovieCard
import { Link, useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Function to handle movie card click
  const handleMovieClick = async () => {
    try {
      // First, check if the movie exists in the database
      const response = await fetch(
        `http://localhost:5000/movies/check/${movie.title}`
      );
      const data = await response.json();

      // If the movie doesn't exist, add it to the database
      if (!data.exists) {
        const addResponse = await fetch("http://localhost:5000/movies/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            overview: movie.overview,
          }),
        });

        const addResult = await addResponse.json();
        if (addResponse.ok) {
          console.log("Movie added to database:", addResult.movie);
        } else {
          console.error("Error adding movie:", addResult.error);
        }
      } else {
        console.log("Movie already exists in the database.");
      }

      // After ensuring the movie is added (if necessary), navigate to the movie detail page
      navigate(`/movies/${movie.title}`);
    } catch (error) {
      console.error("Error checking or adding movie:", error);
    }
  };

  const navigateToMovieDetail = () => {
    // Ensure we first run the handleClick before navigating
    handleMovieClick().then(() => {
      // Once the movie is inserted (or confirmed to exist), navigate to the detail page
      // Use encodeURIComponent to handle any special characters in the movie title
      window.location.href = `/movies/${movie.title}`;
    });
  };
  return (
    <div onClick={navigateToMovieDetail}>
      <Link to={`/movies/${movie.title}`}>
        <div className="movie-card">
          <img
            src={movie.poster_path}
            onError={(e) => {
              e.target.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            }}
            alt={movie.title || "Movie Poster"}
            className="movie-poster"
          />

          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
