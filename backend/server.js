import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import Movie from "./Models/Movie.js";
import updateAllMovieReviews from "./Controller/MovieController.js";

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

app.get("/movies/:title", async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movie.findOne({ title: title.replace(/_/g, " ") }); // Replace underscores with spaces
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
    console.log(movie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// app.get("/update-all-reviews", async (req, res) => {
//   await updateAllMovieReviews();
//   res.send(
//     "Review update process for all movies with empty comments has been initiated."
//   );
// });

// Start server
app.listen(5000, async () => {
  console.log("Server running on port 5000");
  // await updateAllMovieReviews();
});
