import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import RestaurantList from './Components/RestrauntList';
import Home from './Components/Home';
import ReservationForm from './Components/ReservationForm';
import About from './Components/About';
import Contact from './Components/ContactUs';
import Footer from './Components/Footer';

function App() {
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [userLocationFetched, setUserLocationFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setUserLocationFetched(true);
                },
                (error) => {
                    console.warn("Geolocation failed or was denied. Using fallback location (New Delhi).", error.message);
                    // Fallback to New Delhi coordinates
                    setCoordinates({
                        latitude: 28.6139,
                        longitude: 77.2090
                    });
                    setUserLocationFetched(true);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

        } else {
            console.log("Geolocation is not supported by this browser.");
            setUserLocationFetched(false);
        }
    }, []);

    const handleCoordinatesChange = (latitude, longitude) => {
        setCoordinates({ latitude, longitude });
        navigate('/restaurants');
    };

    return (
        <div>
            <Header 
                onCoordinatesChange={handleCoordinatesChange}
                userLocationFetched={userLocationFetched}
            />
            <Routes>
                <Route path="/" element={
                    <>
                        <Home 
                            coordinates={coordinates}
                            userLocationFetched={userLocationFetched}
                            onCoordinatesChange={handleCoordinatesChange}
                        />
                        <About />
                        <Contact />
                    </>
                } />
                <Route
                    path="/restaurants"
                    element={
                        <RestaurantList
                            latitude={coordinates.latitude}
                            longitude={coordinates.longitude}
                        />
                    }
                />
                <Route path="/reservationForm" element={<ReservationForm />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;