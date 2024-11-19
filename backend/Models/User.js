import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Email validation regex
  },
  password: { type: String, required: true },
  terms: { type: Boolean, required: true },
  profileImage: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
