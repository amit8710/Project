import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Movie from "./Models/Movie.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/CineMood");

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  },
  password: { type: String, required: true },
  terms: { type: Boolean, required: true },
  profileImage: { type: String, default: null }, // New field for profile image
});

const User = mongoose.model("User", userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
};

// Registration Route
app.post("/api/register", async (req, res) => {
  const { username, email, password, terms, profileImage } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email is already in use" });

    if (!terms)
      return res
        .status(400)
        .json({ error: "You must accept the terms and conditions" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      terms,
      profileImage: profileImage || null, // Store profile image if provided
    });
    await newUser.save();

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      token,
      profileImage: user.profileImage, // Include profile image in response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

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

// Route to add the movie to the database if it doesn't exist
app.post("/movies/add", async (req, res) => {
  const { title, poster_path, release_date, overview } = req.body;

  try {
    // Check if the movie already exists by title
    const existingMovie = await Movie.findOne({ title: title });

    if (existingMovie) {
      return res
        .status(400)
        .json({ error: "Movie already exists in the database." });
    }

    // If the movie does not exist, create and save the new movie
    const newMovie = new Movie({
      title,
      poster_path,
      release_date,
      overview,
      comments: [], // Initialize the comments array as empty
    });

    await newMovie.save();

    // Return the newly added movie in the response
    res.status(201).json({ movie: newMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to check if a movie exists in the database
app.get("/movies/check/:title", async (req, res) => {
  const { title } = req.params;

  try {
    // Find the movie by title in the database
    const movie = await Movie.findOne({ title: title });

    if (movie) {
      // If the movie exists, return { exists: true }
      return res.json({ exists: true });
    } else {
      // If the movie doesn't exist, return { exists: false }
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking movie:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
