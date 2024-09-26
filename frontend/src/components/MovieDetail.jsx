import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./MovieDetail.css"; // Importing CSS

const MovieDetail = () => {
  const { title } = useParams(); // Get the movie title from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies/${title}`);
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [title]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1 className="movie-title">
            {movie.title} <span>({movie.release_date.split("-")[0]})</span>
          </h1>
          <p className="movie-overview">{movie.overview}</p>
        </div>
      </div>

      <div className="movie-reviews">
        <h3>Recent Reviews</h3>

        <p>No recent reviews available.</p>
      </div>
    </div>
  );
};

export default MovieDetail;
