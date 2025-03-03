import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path === "#contact" || path === "#aboutUs") {
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

  const handleReserveTableClick = (e) => {
    e.preventDefault();
    navigate("/restaurants");
    e.target.blur(); // Removes focus from the button
};


  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.href = "/"; // ✅ Refresh page and navigate to home
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/" onClick={handleHomeClick}>Home</a>
            </li>
            <li><a href="/restaurants">Restaurants</a></li>
            <li>
              <button onClick={(handleReserveTableClick) => navigate("/restaurants")}>
                Reserve Table
              </button>
            </li>
            <li>
              <a
                href="#aboutUs"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("#aboutUs");
                }}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("#contact");
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: info@restaurantfinder.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Foodie Street, Gourmet City, 12345</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">TW</a>
            <a href="#" className="social-icon">IG</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Restaurant Finder. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
