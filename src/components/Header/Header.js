import React, { useContext } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

const Header = () => {
  const [loggedInUser] = useContext(UserContext);

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <h1
            className="navbar-brand"
            style={{ fontSize: "35px", fontWeight: "700" }}
          >
            Ride Booking
          </h1>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item ms-5">
                <Link to="/home" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item ms-5">
                <Link to="/destination/CAR" className="nav-link">
                  Destination
                </Link>
              </li>
              <li className="nav-item ms-5 login-btn">
                {!loggedInUser.name ? (
                  <Link
                    to="/login"
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    Login
                  </Link>
                ) : (
                  <p className="name">{loggedInUser.name}</p>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
