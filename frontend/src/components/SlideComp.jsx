import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SlideComp.css";
import useFetchFromDB from "../hooks/useFetchFromDB";

// Fetch popular movies from TMDB API
const fetchPopularMoviesFromTMDB = async () => {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTJlODlhYzM2Njc3ZDMxYWE4ZGQ5ZDQ0ZjdlNGYxMCIsIm5iZiI6MTcyNjU2MjExMi4zMjMwNDMsInN1YiI6IjY2ZGRjZDQxYmI3ZGU5ZjIzNzM4YzM1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NxpgOEY7mXH8jDEsP_wiV0G4dn_VY9-WqJME1_HaXOE",
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.results.map((movie) => ({
    title: movie.original_title,
    overview: movie.overview,
    poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    release_date: movie.release_date,
  }));
};

// Save movies to the backend (let the backend handle uniqueness)
const saveMoviesToDB = async (movies) => {
  const url = "http://localhost:5000/save-movies";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movies),
  });
};

const SlideComp = () => {
  const { movies: dbMovies, loading, error } = useFetchFromDB();

  useEffect(() => {
    const fetchAndSaveMovies = async () => {
      try {
        // Fetch popular movies from TMDB
        const tmdbMovies = await fetchPopularMoviesFromTMDB();

        // Save movies to backend (backend handles duplicates)
        await saveMoviesToDB(tmdbMovies);

        console.log("Movies sent to the backend for processing.");
      } catch (err) {
        console.error("Error fetching and saving movies:", err);
      }
    };

    if (!loading) {
      fetchAndSaveMovies();
    }
  }, [loading]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error fetching movies: {error}</p>;

  return (
    <section className="popular-movies">
      <h2>What's Popular</h2>
      <Slider {...sliderSettings}>
        {dbMovies.map((movie, index) => (
          <div className="movie-card" key={index}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>Release: {movie.release_date}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default SlideComp;
