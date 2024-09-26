import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img className="logoimg" src="/logoooo.png" alt="" />
        </Link>
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
