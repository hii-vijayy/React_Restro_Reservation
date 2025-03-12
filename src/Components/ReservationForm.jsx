import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';

const ReservationForm = () => {
    const location = useLocation();
    const [restaurantName, setRestaurantName] = useState(location.state?.restaurantName || '');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_KEY_ACCESS_TOKEN;
    const RESERVATION_TEMPLATE_ID = import.meta.env.VITE_RESERVATION_TEMPLATE_ACCESS_TOKEN;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_ACCESS_TOKEN;

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        emailjs
            .sendForm(SERVICE_ID, RESERVATION_TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                setSuccessMessage('✅ Reservation request sent successfully!');
                formRef.current.reset();
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch((error) => {
                const errorDetail = error.text || 'Something went wrong. Please try again.';
                setErrorMessage(`❌ Failed to send reservation. ${errorDetail}`);
                setTimeout(() => setErrorMessage(''), 5000);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="reservation-form-container">
            <h2>Make a Reservation</h2>
            <form ref={formRef} onSubmit={sendEmail}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="to_name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="to_email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="restaurant">Restaurant:</label>
                    <input 
                        type="text" 
                        name="restaurant_name" 
                        value={restaurantName} 
                        onChange={(e) => setRestaurantName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input type="date" name="reservation_date" required />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input type="time" name="reservation_time" required />
                </div>
                <div className="form-group">
                    <label htmlFor="guests">Number of Guests:</label>
                    <input type="number" name="guest_count" placeholder="Enter number of guests" min="1" required />
                </div>
                <div className="form-group">
                    <label htmlFor="special_requests">Special Requests:</label>
                    <textarea name="message" placeholder="Any special requests?"></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <span className="loader"></span> : "Book Table"}
                </button>

                {successMessage && <div className="message success-message">{successMessage}</div>}
                {errorMessage && <div className="message error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default ReservationForm;
