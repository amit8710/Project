// Import dependencies using ES module syntax
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined in .env');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
connectDB();

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

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Registration Route
app.post('/api/register', async (req, res) => {
  const { username, email, password, terms, profileImage } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email is already in use' });

    if (!terms) return res.status(400).json({ error: 'You must accept the terms and conditions' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      terms,
      profileImage: profileImage || null, // Store profile image if provided
    });
    await newUser.save();

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      token,
      profileImage: user.profileImage, // Include profile image in response
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Update Profile Image Route
app.put('/api/user/profile-image', authenticateToken, async (req, res) => {
  const { profileImage } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      message: 'Profile image updated successfully',
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Error updating profile image:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Protected Route Example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.user.userId });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
