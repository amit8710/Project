// MovieCard.js
import React from "react";
import "./MovieCard.css"; // Style your MovieCard
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <>
      <Link to={`/movies/${movie.title}`}>
        <div className="movie-card">
          <img
            src={movie.poster_path}
            alt={movie.title}
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
    </>
  );
};

export default MovieCard;
