import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  poster_path: String,
  release_date: String,
  overview: String,
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

export default Movie;
