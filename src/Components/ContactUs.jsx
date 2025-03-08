"use client"

import { useState } from "react"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }

    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear the error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call for email sending
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Send email (this would be a real API call in production)
      console.log("Sending email from contact form:", formData)

      setSubmitSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false)
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      }, 3000)
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setFormErrors({ submit: "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-section" id="contact">
      <h2>Contact Us</h2>

      {submitSuccess ? (
        <div className="success-message">
          <p>Thank you for your message! We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name">Name *</label>
            <input type="text" id="contact-name" name="name" value={formData.name} onChange={handleChange} />
            {formErrors.name && <p className="error">{formErrors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Email *</label>
            <input type="email" id="contact-email" name="email" value={formData.email} onChange={handleChange} />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">Subject *</label>
            <input type="text" id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} />
            {formErrors.subject && <p className="error">{formErrors.subject}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {formErrors.message && <p className="error">{formErrors.message}</p>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {formErrors.submit && <p className="error">{formErrors.submit}</p>}
        </form>
      )}
    </div>
  )
}

export default Contact

