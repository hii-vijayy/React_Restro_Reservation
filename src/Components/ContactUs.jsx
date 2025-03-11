import React, { useState } from "react";
import emailjs from "emailjs-com";

function Contact() {
  const [formData, setFormData] = useState({
    to_name: "",
    to_email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    emailjs
      .send(
        "service_7g2yp7e",
        "template_f9nanlh",
        {
          to_name: formData.to_name,
          to_email: formData.to_email,
          subject: formData.subject,
          message: formData.message,
        },
        "UVNys2HZbIB70VnQs"
      )
      .then((response) => {
        setSuccessMessage("✅ Message sent successfully! We'll get back to you soon.");
        setFormData({ to_name: "", to_email: "", subject: "", message: "" });

        setTimeout(() => {
          setSuccessMessage(""); // Hide success message after 3 sec
        }, 3000);
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        setErrorMessage(`❌ ${errorMsg}`);

        setTimeout(() => {
          setErrorMessage(""); // Hide error message after 5 sec
        }, 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getErrorMessage = (error) => {
    if (error?.response?.text) return error.response.text; // Fetch error from response
    if (error.status === 400) return "Invalid request. Please check your inputs.";
    if (error.status === 401) return "Unauthorized access. Check your EmailJS credentials.";
    if (error.status === 500) return "Server error. Please try again later.";
    return "Something went wrong. Please try again.";
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="to_name"
              value={formData.to_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="to_email"
              value={formData.to_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : "Send Message"}
          </button>

          {/* Success & Error Messages Below the Button */}
          {successMessage && <div className="message success-message">{successMessage}</div>}
          {errorMessage && <div className="message error-message">{errorMessage}</div>}
        </form>
      </div>
    </section>
  );
}

export default Contact;
