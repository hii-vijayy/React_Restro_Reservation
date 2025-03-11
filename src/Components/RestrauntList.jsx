import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestrauntCard';
import { useLocation } from 'react-router-dom';
import '../App.css';

function RestaurantList({ latitude, longitude }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!latitude || !longitude) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.mapbox.com/search/searchbox/v1/category/restaurant?proximity=${longitude},${latitude}&limit=10&language=en&access_token=${mapboxAccessToken}`
                );

                if (!response.ok) throw new Error('Failed to fetch restaurants.');
                const data = await response.json();
                
                const restaurantsList = data.features.map((feature, index) => ({
                    id: feature.mapbox_id || feature.id || `restaurant-${index}`,
                    name: feature.properties.name || 'Unknown Name',
                    address: feature.properties.full_address || 'Address not available',
                    coordinates: feature.geometry.coordinates,
                }));

                setRestaurants(restaurantsList);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Error fetching restaurants. Please try again.');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [latitude, longitude, mapboxAccessToken]);

    if (loading) {
        return <div className="loading">Loading restaurants...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (restaurants.length === 0) {
        return <div className="no-results">No restaurants found in this area.</div>;
    }

    return (
        <div className="restaurant-list-container">
            <h2>Nearby Restaurants</h2>
            <div className="restaurant-grid">
                {restaurants.map((restaurant) => (
                    <RestaurantCard 
                        key={restaurant.id}
                        id={restaurant.id}
                        name={restaurant.name}
                        address={restaurant.address}
                    />
                ))}
            </div>
        </div>
    );
}

export default RestaurantList;
