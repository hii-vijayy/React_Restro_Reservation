import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ id, name = 'Unknown Restaurant', address = 'Address not available' }) => {
    const navigate = useNavigate();

    const handleReserve = () => {
        navigate('/reservationForm', {
            state: { restaurantName: name }  // Passing the restaurant name as state
        });
    };

    return (
        <article className="restaurant-card">
            <h3 className="restaurant-name">{name}</h3>
            <p className="restaurant-address">{address}</p>
            <button className="reserve-button" onClick={handleReserve}>Reserve Table</button>
        </article>
    );
};

export default RestaurantCard;
