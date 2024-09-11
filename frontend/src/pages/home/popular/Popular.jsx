import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "./../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";
import axios from "axios";

const Popular = () => {
  // State to store movies
  const [movies, setMovies] = useState([]);

  // Fetch data from the selected endpoint
  const { data, loading } = useFetch("/movie/popular");

  console.log(data);

  // const checkAndInsertMovie = async (movie) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/check-and-insert-movie",
  //       {
  //         id: movie.id,
  //         title: movie.title,
  //       }
  //     );

  //     console.log(response.data.message);
  //   } catch (error) {
  //     console.error("Error inserting movie:", error);
  //   }
  // };

  // Whenever `data` is fetched, update the local movies state
  useEffect(() => {
    if (data?.results) {
      // Create an array with only id and title
      const moviesWithIdAndTitle = data.results.map(({ id, title }) => ({
        id,
        title,
      }));

      // Update state with the new array
      setMovies(moviesWithIdAndTitle);

      // Log only the id and title of each movie
      console.log("Movies with ID and Title:", moviesWithIdAndTitle);
    }
  }, [data]);

  // // Check and insert movies into MongoDB
  // useEffect(() => {
  //   if (movies.length > 0) {
  //     movies.forEach((movie) => {
  //       checkAndInsertMovie(movie);
  //     });
  //   }
  // }, [movies]);

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">What's Popular</span>
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint="movie" />
    </div>
  );
};

export default Popular;
