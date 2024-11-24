import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Assuming axios is installed

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
        console.log("Fetched Movie Details:", data); // Add this for debugging
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovieDetails();
  }, [title]);
  
  const handleAddToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to manage your watchlist.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });
  
      console.log("Request body:", { movieId }); // Log the request body
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log the error response
        throw new Error(errorData.error || "Failed to add movie to watchlist");
      }
  
      alert("Movie added to watchlist!");
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("Failed to add movie to watchlist");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-detail-container">
      <div className="movie-header">
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

        {/* Add to Watchlist Button */}
        <button
  onClick={() => handleAddToWatchlist(movie._id)} // Pass movie._id dynamically
  className="add-to-watch-btn"
>
  Add to Watchlist
</button>
      </div>

      <div className="movie-reviews">
        <h3>Recent Reviews</h3>
        <p>No recent reviews available.</p>
      </div>
    </div>
  );
};

export default MovieDetail;
