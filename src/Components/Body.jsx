import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservation from '../assets/reservation.png';
import nearbyRestaurants from '../assets/nearby-restaurants.png';
import delhi from '../assets/delhi.png';
import mumbai from '../assets/mumbai.png';
import punjab from '../assets/punjab.png';
import jaipur from '../assets/jaipur.png';

function Body() {
    const [city, setCity] = useState('');
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    const fetchRestaurantLocations = async (selectedCity) => {
        if (!selectedCity.trim()) {
            alert('Please enter a city first!');
            return;
        }
    
        try {
            const apiKey = process.env.REACT_APP_MAPBOX_API_KEY;
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=place:${selectedCity}&access_token=${apiKey}`
            );
    
            if (!response.ok) {
                throw new Error('Failed to fetch restaurant locations.');
            }
    
            const data = await response.json();
            console.log("Raw API response:", data); // ✅ Log raw API response
    
            // Extract restaurant names and addresses
            const restaurantLocations = data.features.map((feature) => ({
                name: feature.text || "Unknown",
                address: feature.place_name || "Address not available",
            }));
    
            console.log("Processed restaurants before navigation:", restaurantLocations); // ✅ Log extracted data
    
            if (restaurantLocations.length === 0) {
                alert("No restaurants found in this city.");
                return;
            }
            console.log("📌 Navigating with:", restaurantLocations);
            navigate('/restaurants', { state: { restaurants: restaurantLocations } });
            
            // ✅ Ensure data is passed properly during navigation
            navigate('/restaurants', {
                state: {
                    city: selectedCity || "Unknown City",
                    restaurants: restaurantLocations.length > 0 ? restaurantLocations : [],
                    isSearching: true,
                },
            });
    
        } catch (error) {
            console.error('Error fetching restaurant locations:', error);
            alert('Failed to fetch restaurant locations. Please try again.');
        }
    };
    
    
    
    

    const handleNearbyRestaurantsClick = () => {
        if (!city.trim()) {
            alert('Please enter a city first!');
            return;
        }

        fetchRestaurantLocations(city);

        navigate('/restaurants', { state: { city, isSearching: true } });
 // Redirect to Restaurants page with the city
    };

    const handleCityClick = (cityName) => {
        setCity(cityName);
        fetchRestaurantLocations(); // Fetch locations for the selected city
    };

    return (
        <>
            <div className="main-body">
                {/* Top Body */}
                <div className="top-body">
                    <div className="common" onClick={() => alert('Open reservation form')}>
                        <img src={reservation} alt="" />
                        <h3>Reserve Table</h3>
                        <p>Book your table now</p>
                    </div>
                    <div className="common" onClick={handleNearbyRestaurantsClick}>
                        <img src={nearbyRestaurants} alt="" />
                        <h3>Nearby Restaurants</h3>
                        <p>Get restaurants around you</p>
                    </div>
                </div>

                {/* Popular Cities */}
                <div className="popular-cities">
                    <h1>Popular Cities</h1>
                    <div className="cities">
                        <div className="mumbai" onClick={() => handleCityClick('Mumbai')}>
                            <img src={mumbai} alt="" />
                            <h3>Mumbai</h3>
                        </div>
                        <div className="jaipur" onClick={() => handleCityClick('Jaipur')}>
                            <img src={jaipur} alt="" />
                            <h3>Jaipur</h3>
                        </div>
                        <div className="delhi" onClick={() => handleCityClick('Delhi')}>
                            <img src={delhi} alt="" />
                            <h3>Delhi</h3>
                        </div>
                        <div className="punjab" onClick={() => handleCityClick('Punjab')}>
                            <img src={punjab} alt="" />
                            <h3>Punjab</h3>
                        </div>
                    </div>
                </div>

                {/* Nearby Locations */}
                <div className="nearby-locations">
                    <h1>Nearby Locations</h1>
                    <div className="locations">
                        {locations.length > 0 ? (
                            locations.map((location, index) => (
                                <div key={index} className="location-card">
                                    <h3>{location.name}</h3>
                                    <p>{location.address}</p>
                                </div>
                            ))
                        ) : (
                            <p>No locations found. Enter a city to find nearby places.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Body;
