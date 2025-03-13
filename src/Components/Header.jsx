import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import websiteLogo from "../assets/logo.png";
import cityIcon from "../assets/city-map.png"
import "../App.css";

function Header({ onCoordinatesChange, userLocationFetched }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentCity, setCurrentCity] = useState("Your City");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.state]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHomeClick = (e) => {
    e.preventDefault()
    window.location.href = "/" // Refresh page and navigate to home
  }
  const handleCityChange = async (e) => {
    const value = e.target.value
    setCity(value)

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?country=in&types=place&access_token=${mapboxAccessToken}`,
        )

        if (response.ok) {
          const data = await response.json()
          const cityResults = data.features.map((feature) => feature.place_name)
          setSuggestions(cityResults.slice(0, 5))
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err)
      }
    } else {
      setSuggestions([])
    }
  }
  

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?country=in&types=place&access_token=${mapboxAccessToken}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates for the city.");
      }

      const data = await response.json();
      const feature = data.features[0];
      if (feature) {
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        const cityName = feature.place_name.split(",")[0];

        setCurrentCity(cityName);
        onCoordinatesChange(latitude, longitude);
        setCity("");
        setSuggestions([]);
      } else {
        setError("No results found for the specified city.");
      }
    } catch (err) {
      setError("Error fetching city coordinates. Please try again.");
      console.error(err);
    }
  };

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
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

  return (
    <div className="navbar-head">
      <div className="navbar">
        <div className="navbar-top">
          <div className="navbar-logo">
            <a href="/" onClick={handleHomeClick}>
              <img src={websiteLogo || "/placeholder.svg"} alt="logo" className="logo" />
            </a>
          </div>
              <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <div className="navbar-menu">
            <ul>
              <li><a href="/" onClick={handleHomeClick}>Home</a></li>
              <li><a href="/restaurants" onClick={(e) => { e.preventDefault(); handleNavigation("/restaurants") }}>Restaurants</a></li>
              <li><a href="/restaurants" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavigation("/restaurants") }}>Reserve Table</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavigation("#contact") }}>Contact</a></li>
              <li><a href="#aboutUs" onClick={(e) => { e.preventDefault(); handleNavigation("#aboutUs") }}>About</a></li>
            </ul>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isSidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
      

{/* Sidebar Menu */}
<div className={`mobile-menu-sidebar ${isSidebarOpen ? "active" : ""}`}>
  <div className="mobile-menu-header">
  <a href="/" onClick={handleHomeClick}>
    <img src={websiteLogo} alt="logo" className="mobile-menu-logo" />
    </a>
    <button className="mobile-menu-close" onClick={toggleSidebar}>×</button>
  </div>
  <div className="mobile-menu-items">
    <ul>
      <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavigation("/"); }}>Home</a></li>
      <li><a href="/restaurants" onClick={(e) => { e.preventDefault(); handleNavigation("/restaurants"); }}>Restaurants</a></li>
      <li><a href="/restaurants" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavigation("/restaurants") }}>Reserve Table</a></li>
      <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavigation("#contact"); }}>Contact</a></li>
      <li><a href="#aboutUs" onClick={(e) => { e.preventDefault(); handleNavigation("#aboutUs"); }}>About</a></li>
    </ul>
  </div>
</div>
        <div className="search">
          <div className="navbar-heading">
            <h1 className="search-heading">Discover the best restaurants in {currentCity}</h1>
            <div className="search-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Enter Your City"
                  className="search-box"
                  value={city}
                  onChange={handleCityChange}
                />
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item" onClick={() => selectSuggestion(suggestion)}>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                <button className="searchbtn" onClick={handleSearch}>Search</button>
              </div>
            </div>
          </div>
          <div className="city-icon">
            <img src={cityIcon || "/placeholder.svg"} alt="City Icon" />
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Header;
