import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userprofile.css";

function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle the dropdown menu toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle the logout action
  const handleLogout = () => {
    // Clear authentication tokens and localStorage
    localStorage.removeItem("authToken");
    localStorage.setItem("stayLoggedIn", "false"); // Update stayLoggedIn to false
    localStorage.removeItem("isLoggedIn");

    // Navigate to the login page
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="user-profile">
      {/* User Profile Icon */}
      <div className="profile-icon" onClick={toggleDropdown}>
        <img
          src="path_to_user_profile_image.jpg" // Replace with actual profile image path or icon URL
          alt="User Profile"
          className="profile-img"
        />
      </div>

      {/* Dropdown Menu for Logout and Watch List */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <Link to="/watchlist" className="dropdown-item">
            Watch List
          </Link>
          <button onClick={handleLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
