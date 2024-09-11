import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Movie from "./Models/Movie.js";

dotenv.config();

const app = express();

app.use(express.json()); // allows to accept json data as body
app.use(cors());

app.post("/api/check-and-insert-movie", async (req, res) => {
  const { id, title } = req.body;

  try {
    // Validate the data
    if (!id || !title) {
      return res
        .status(400)
        .json({ error: "Movie id and title are required." });
    }

    // Check if the movie exists by ID
    const movieExists = await Movie.findOne({ id });

    if (movieExists) {
      return res
        .status(200)
        .json({ message: "Movie already exists in the database." });
    }

    // Insert the new movie if it doesn't exist
    const newMovie = new Movie({ id, title });
    await newMovie.save();

    return res
      .status(201)
      .json({ message: "Movie added to the database.", movie: newMovie });
  } catch (error) {
    console.error("Error inserting movie:", error.message); // Log the exact error
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("listening at http://localhost:5000");
});
