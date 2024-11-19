import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import LoginForm from "./components/loginsignup/LoginForm";
import RegistrationForm from "./components/loginsignup/RegistrationForm";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Always reset isLoggedIn to false on page refresh to force login
    setIsLoggedIn(false);
  }, []);

  return (
    <div className="App">
      <Router>
        {/* Common Layout for Header and Footer */}
        <Header />
        <Routes>
          {/* Route for login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <LoginForm setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* Route for registration */}
          <Route path="/register" element={<RegistrationForm />} />

          {/* Protected route for home */}
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />

          {/* Protected route for movie details */}
          <Route
            path="/movies/:title"
            element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />}
          />

          {/* Redirect all other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;