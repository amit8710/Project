import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "./../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";
import axios from "axios";

const Popular = () => {
  // Fetch data from the selected endpoint
  const { data, loading } = useFetch("/movie/popular");

  console.log(data);

  const checkAndInsertMovie = async (movie) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/check-and-insert-movie",
        {
          id: movie.id,
          title: movie.title,
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error inserting movie:", error);
    }
  };

  // Whenever `data` is fetched, check and insert movies into MongoDB
  useEffect(() => {
    if (data?.results) {
      console.log(data.results);
      const movies = data.results;

      movies.forEach((movie) => {
        checkAndInsertMovie(movie);
      });
    }
  }, [data]);

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
