import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Default user icon

const Header = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for login state and retrieve user data
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");

    console.log("Stored Email:", storedEmail); // Debugging log
    console.log("Stored Token:", storedToken); // Debugging log

    if (storedEmail && storedToken) {
      console.log("User is logged in");
      setUserEmail(storedEmail);
      setIsLoggedIn(true);

      // Generate profile image URL (simulating user profile image fetch)
      setProfileImage(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          storedEmail
        )}&background=random`
      );
    } else {
      console.log("User is not logged in");
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img className="logoimg" src="/logoooo.png" alt="Logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>Movies</li>
          <li>
            <i className="fa fa-search"></i>
          </li>
          <li className="profileIcon">
            <div className="profileWrapper">
              {/* Profile Image */}
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="profileImage"
                />
              ) : (
                <FaUserCircle size={40} />
              )}
              {/* Online Status Indicator */}
              {isLoggedIn && <span className="onlineStatus" />}
            </div>
            {/* Show email if logged in */}
            {isLoggedIn && <span className="userEmail">{userEmail}</span>}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
