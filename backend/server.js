import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import Movie from "./Models/Movie.js";

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/CineMood");

// Route to save movies in the database
app.post("/save-movies", async (req, res) => {
  try {
    const movies = req.body;

    for (const movie of movies) {
      // Check if the movie with the same title already exists in the database
      const existingMovie = await Movie.findOne({ title: movie.title });

      if (!existingMovie) {
        // If the movie doesn't exist, insert it
        const newMovie = new Movie(movie);
        await newMovie.save();
        console.log(`Movie "${movie.title}" added to the database.`);
      } else {
        console.log(`Movie "${movie.title}" already exists in the database.`);
      }
    }

    res.status(200).send("Movies processed successfully.");
  } catch (error) {
    console.error("Error processing movies:", error);
    res.status(500).send("Error processing movies");
  }
});

// Route to fetch movies from the database
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send("Error fetching movies");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
