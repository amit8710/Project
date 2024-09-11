import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: {
      type: String,
      required: true,
    },
    // comments: {
    //   type: Array,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema); // mongoose wiwlll save as movies itself

export default Movie;
