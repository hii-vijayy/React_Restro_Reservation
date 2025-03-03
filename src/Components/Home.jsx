import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservation from '../assets/reservation.png';
import nearbyRestaurants from '../assets/nearby-restaurants.png';
import delhi from '../assets/delhi.png';
import mumbai from '../assets/mumbai.png';
import punjab from '../assets/punjab.png';
import jaipur from '../assets/jaipur.png';

function Home({ coordinates, userLocationFetched, onCoordinatesChange }) {
    const navigate = useNavigate();

    const handleNearbyRestaurantsClick = () => {
        if (!userLocationFetched) {
            alert('Please allow location access or enter a city to find nearby restaurants.');
        } else {
            navigate('/restaurants');
        }
    };

    const handleCityClick = (cityName) => {
        // Use the Mapbox Geocoding API to get coordinates for the city
        const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${mapboxAccessToken}`)
            .then(response => response.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const [longitude, latitude] = data.features[0].center;
                    onCoordinatesChange(latitude, longitude);
                } else {
                    alert('City not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching city coordinates:', error);
                alert('Error fetching city coordinates. Please try again.');
            });
    };

    return (
        <div className="main-body">
            <div className="top-body">
                <div className="common" onClick={() => navigate('/reservationForm')}>
                    <img src={reservation || "/placeholder.svg"} alt="" />
                    <h3>Reserve Table</h3>
                    <p>Book your table now</p>
                </div>
                <div className="common" onClick={handleNearbyRestaurantsClick}>
                    <img src={nearbyRestaurants || "/placeholder.svg"} alt="" />
                    <h3>Nearby Restaurants</h3>
                    <p>Get restaurants around you</p>
                </div>
            </div>

            <div className="popular-cities">
                <h1>Popular Cities</h1>
                <div className="cities">
                    <div className="mumbai" onClick={() => handleCityClick('Mumbai')}>
                        <img src={mumbai || "/placeholder.svg"} alt="" />
                        <h3>Mumbai</h3>
                    </div>
                    <div className="jaipur" onClick={() => handleCityClick('Jaipur')}>
                        <img src={jaipur || "/placeholder.svg"} alt="" />
                        <h3>Jaipur</h3>
                    </div>
                    <div className="delhi" onClick={() => handleCityClick('Delhi')}>
                        <img src={delhi || "/placeholder.svg"} alt="" />
                        <h3>Delhi</h3>
                    </div>
                    <div className="punjab" onClick={() => handleCityClick('Punjab')}>
                        <img src={punjab || "/placeholder.svg"} alt="" />
                        <h3>Punjab</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;