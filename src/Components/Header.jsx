"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import websiteLogo from "../assets/logo.png"
import cityIcon from "../assets/city-map.png"
import "../App.css"

function Header({ onCoordinatesChange, userLocationFetched, resetLocation }) {
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const [suggestions, setSuggestions] = useState([])
  const [currentCity, setCurrentCity] = useState("Your City")

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(location.state.scrollTo)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [location.state])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.")
      return
    }

    setError("")

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?country=in&types=place&access_token=${mapboxAccessToken}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates for the city.")
      }

      const data = await response.json()
      const feature = data.features[0]
      if (feature) {
        const latitude = feature.geometry.coordinates[1]
        const longitude = feature.geometry.coordinates[0]
        const cityName = feature.place_name

        setCurrentCity(cityName)
        onCoordinatesChange(latitude, longitude)
        setCity("")
        setSuggestions([])
      } else {
        setError("No results found for the specified city.")
      }
    } catch (err) {
      setError("Error fetching city coordinates. Please try again.")
      console.error(err)
    }
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
          const cityResults = data.features.map((feature) => ({
            name: feature.place_name,
            coordinates: feature.geometry.coordinates,
          }))
          setSuggestions(cityResults.slice(0, 5))
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err)
      }
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (selectedLocation) => {
    setCity("")
    setSuggestions([])
    setCurrentCity(selectedLocation.name)

    const [longitude, latitude] = selectedLocation.coordinates
    onCoordinatesChange(latitude, longitude)
  }

  const clearSearch = () => {
    setCity("")
    setSuggestions([])
  }

  const handleNavigation = (path) => {
    setMenuOpen(false)
    if (path === "/restaurants" && !userLocationFetched) {
      alert("Please enter a city or allow location access to view restaurants.")
    } else if (path === "#contact" || path === "#aboutUs") {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: path } })
      } else {
        const element = document.querySelector(path)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    } else {
      navigate(path)
    }
  }

  const handleHomeClick = (e) => {
    e.preventDefault()
    setCity("")
    setCurrentCity("Your City")
    setSuggestions([])
    if (resetLocation) resetLocation()
    setMenuOpen(false)
    window.location.href = "/" // Force page refresh
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="navbar-head">
      <div className="navbar">
        <div className="navbar-top">
          <div className="navbar-logo">
            <a href="/" onClick={handleHomeClick}>
              <img src={websiteLogo || "/placeholder.svg"} alt="logo" className="logo" />
            </a>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <div className="navbar-menu">
            <ul>
              <li>
                <a href="/" onClick={handleHomeClick}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/restaurants"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation("/restaurants")
                  }}
                >
                  Restaurants
                </a>
              </li>
              <li>
                <a
                  href="/restaurants"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation("/restaurants")
                  }}
                >
                  Reserve Table
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation("#contact")
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#aboutUs"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation("#aboutUs")
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
            <h1 className="search-heading">
              Discover the best restaurants in <span className="city-name">{currentCity}</span>
            </h1>
            <div className="search-bar">
              <div className="search-container">
                <div className="search-box-container">
                  <input
                    type="text"
                    placeholder="Enter Your City"
                    className="search-box"
                    value={city}
                    onChange={handleCityChange}
                  />
                  {city && (
                    <button className="clear-search" onClick={clearSearch}>
                      ×
                    </button>
                  )}
                  <button className="searchbtn" onClick={handleSearch}>
                    Search
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item" onClick={() => selectSuggestion(suggestion)}>
                        {suggestion.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="city-icon">
            <img src={cityIcon || "/placeholder.svg"} alt="City Icon" />
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      {/* Mobile Menu Overlay - This was missing */}
      <div className={`mobile-menu-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)}></div>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-menu-sidebar ${menuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <img src={websiteLogo || "/placeholder.svg"} alt="logo" className="mobile-menu-logo" />
          <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        </div>
        <div className="mobile-menu-items">
          <ul>
            <li>
              <a href="/" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li>
              <a
                href="/restaurants"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation("/restaurants")
                }}
              >
                Restaurants
              </a>
            </li>
            <li>
              <a
                href="/restaurants"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation("/restaurants")
                }}
              >
                Reserve Table
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation("#contact")
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#aboutUs"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation("#aboutUs")
                }}
              >
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header

