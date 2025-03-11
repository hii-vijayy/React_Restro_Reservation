import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';

const ReservationForm = () => {
    const location = useLocation();
    const [restaurantName, setRestaurantName] = useState(location.state?.restaurantName || '');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null);

    const sendEmail = (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        emailjs
            .sendForm(
                'service_7g2yp7e',  
                'template_4hnd8w8',  
                formRef.current,
                'UVNys2HZbIB70VnQs'
            )
            .then((response) => {
                setSuccessMessage('✅ Reservation request sent successfully!');
                formRef.current.reset();

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            })
            .catch((error) => {
                // Extracting error details
                const errorDetail = error.text || 'Something went wrong. Please try again.';
                setErrorMessage(`❌ Failed to send reservation. ${errorDetail}`);

                // Hide error message after 5 seconds
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            });
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

                <button type="submit" className="submit-btn">Book Table</button>

                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default ReservationForm;
