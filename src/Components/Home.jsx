"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import reservation from "../assets/reservation.png"
import nearbyRestaurants from "../assets/nearby-restaurants.png"
import delhi from "../assets/delhi.png"
import mumbai from "../assets/mumbai.png"
import punjab from "../assets/punjab.png"
import jaipur from "../assets/jaipur.png"
import Footer from "./Footer"
import AboutUs from "./About"
import ContactUs from "./ContactUs"

function Home({ coordinates, userLocationFetched, onCoordinatesChange }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.querySelector(location.state.scrollTo)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  const handleNearbyRestaurantsClick = () => {
    if (!userLocationFetched) {
      alert("Please allow location access or enter a city to find nearby restaurants.")
    } else {
      navigate("/restaurants")
    }
  }

  const handleNavigation = (path) => {
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

  const handleCityClick = (cityName) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${mapboxAccessToken}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center
          onCoordinatesChange(latitude, longitude)
          navigate("/restaurants") // Navigate to restaurants page after selecting city
        } else {
          alert("City not found. Please try again.")
        }
      })
      .catch((error) => {
        console.error("Error fetching city coordinates:", error)
        alert("Error fetching city coordinates. Please try again.")
      })
  }

  return (
    <div className="main-body">
      <div className="top-body">
        {/* Reserve Table Button - Now Working */}
        <div className="common" onClick={() => navigate("/restaurants")}>
          <img src={reservation || "/placeholder.svg"} alt="Reserve Table" />
          <h3>Reserve Table</h3>
          <p>Book your table now</p>
        </div>

        {/* Nearby Restaurants */}
        <div className="common" onClick={handleNearbyRestaurantsClick}>
          <img src={nearbyRestaurants || "/placeholder.svg"} alt="Nearby Restaurants" />
          <h3>Nearby Restaurants</h3>
          <p>Get restaurants around you</p>
        </div>
      </div>

      <div className="popular-cities">
        <h1>Popular Cities</h1>
        <div className="cities">
          <div className="mumbai" onClick={() => handleCityClick("Mumbai")}>
            <img src={mumbai || "/placeholder.svg"} alt="Mumbai" />
            <h3>Mumbai</h3>
          </div>
          <div className="jaipur" onClick={() => handleCityClick("Jaipur")}>
            <img src={jaipur || "/placeholder.svg"} alt="Jaipur" />
            <h3>Jaipur</h3>
          </div>
          <div className="delhi" onClick={() => handleCityClick("Delhi")}>
            <img src={delhi || "/placeholder.svg"} alt="Delhi" />
            <h3>Delhi</h3>
          </div>
          <div className="punjab" onClick={() => handleCityClick("Punjab")}>
            <img src={punjab || "/placeholder.svg"} alt="Punjab" />
            <h3>Punjab</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
