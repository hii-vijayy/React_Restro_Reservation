"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import websiteLogo from "../assets/logo.png";
import cityIcon from "../assets/city-map.png";
import "../App.css";

function Header({ onCoordinatesChange, userLocationFetched }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${mapboxAccessToken}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates for the city.");
      }

      const data = await response.json();

      const feature = data.features[0];
      if (feature) {
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        onCoordinatesChange(latitude, longitude);
        setCity("");
      } else {
        setError("No results found for the specified city.");
      }
    } catch (err) {
      setError("Error fetching city coordinates. Please try again.");
      console.error(err);
    }
  };

  const handleNavigation = (path) => {
    if (path === "/restaurants" && !userLocationFetched) {
      alert("Please enter a city or allow location access to view restaurants.");
    } else if (path === "#contact" || path === "#aboutUs") {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: path } });
      } else {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(path);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.href = "/"; // ✅ Refresh page and navigate to home
  };

  return (
    <div className="navbar-head">
      <div className="navbar">
        <div className="navbar-top">
          <div className="navbar-logo">
            <a href="/" onClick={handleHomeClick}>
              <img src={websiteLogo || "/placeholder.svg"} alt="logo" className="logo" />
            </a>
          </div>
          <div className="navbar-menu">
            <ul>
              <li>
                <a href="/" onClick={handleHomeClick}>Home</a>
              </li>
              <li>
                <Link to="/restaurants"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/restaurants");
                  }}
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <button onClick={() => navigate("/restaurants")}>
                  Reserve Table
                </button>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("#contact");
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#aboutUs"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("#aboutUs");
                  }}
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="search">
          <div className="navbar-heading">
            <h1 className="search-heading">Discover the best restaurants in your city</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter Your City"
                className="search-box"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button className="searchbtn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          <div className="city-icon">
            <img src={cityIcon || "/placeholder.svg"} alt="City Icon" />
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Header;
