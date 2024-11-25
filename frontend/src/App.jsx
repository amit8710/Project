import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import LoginForm from "./components/loginsignup/LoginForm";
import RegistrationForm from "./components/loginsignup/RegistrationForm";
import Watchlist from "./pages/WatchListPage"; // Make sure this is imported

function App() {
  // Initialize isLoggedIn based on stayLoggedIn and isLoggedIn in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stayLoggedIn = localStorage.getItem("stayLoggedIn") === "true";
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    return stayLoggedIn && isLogged;
  });

  useEffect(() => {
    // Sync isLoggedIn state with localStorage whenever it changes
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    // Set isLoggedIn and stayLoggedIn to true on login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("stayLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear authentication tokens and localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("stayLoggedIn");

    // Immediately update isLoggedIn state to false
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginForm setIsLoggedIn={handleLogin} />
              )
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
          <Route
            path="/watchlist"
            element={isLoggedIn ? <Watchlist /> : <Navigate to="/login" />}
          />{" "}
          {/* Add the watchlist route */}
          {/* Redirect all other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// import React, { useState } from "react";

// const App = () => {
//   const [comment, setComment] = useState("");
//   const [sentiment, setSentiment] = useState(null);
//   const [error, setError] = useState(null);

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ comment: comment }), // Send the comment as JSON
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setSentiment(data.sentiment); // Set the sentiment result
//       setError(null);
//     } catch (err) {
//       setError("Error fetching prediction: " + err.message);
//       setSentiment(null);
//     }
//   };

//   return (
//     <div>
//       <h1>Sentiment Analysis</h1>
//       <textarea
//         placeholder="Enter a comment..."
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <button onClick={handleSubmit}>Analyze Sentiment</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {sentiment && <p>Sentiment: {sentiment}</p>}
//     </div>
//   );
// };

// export default App;
