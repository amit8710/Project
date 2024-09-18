import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>CineMood</h1>
      </div>
      <nav>
        <ul>
          <li>Movies</li>
          <li>
            <i className="fa fa-search"></i>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
