# RestroReserve - Restaurant Reservation Web App

RestroReserve is a restaurant reservation web application built with **React.js** that allows users to effortlessly book tables at their favorite restaurants.

## Features

### 🗺️ Location & Restaurant Integration
- Automatically detects the user's location using **latitude and longitude**.
- Fetches and displays nearby restaurants using the **Mapbox API**.
- Allows users to search for restaurants in any city, retrieving results directly from Mapbox.

### 📅 Reservation System
- Users can select a **restaurant, date, time, and number of guests** for their reservation.
- Integrated **EmailJS** to send real-time **confirmation emails** to users and restaurant owners.
- Uses **predefined email templates** for both **contact forms** and **reservation confirmations**.

### ✉️ Contact Form
- Users can reach out with inquiries via a **contact form**.
- Emails are sent using **EmailJS templates**.
- Displays **loading animation** while sending messages for better UX.

## Technologies Used
- **React.js** - Frontend framework
- **JavaScript, HTML, CSS** - Core web technologies
- **Mapbox API** - Fetching and displaying restaurants
- **EmailJS** - Sending automated emails

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/restro-reserve.git
   cd restro-reserve
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```sh
   VITE_EMAILJS_SERVICE_KEY_ACCESS_TOKEN=your_service_id
   VITE_RESERVATION_TEMPLATE_ACCESS_TOKEN=your_reservation_template_id
   VITE_CONTACT_TEMPLATE_ACCESS_TOKEN=your_contact_template_id
   VITE_EMAILJS_PUBLIC_KEY_ACCESS_TOKEN=your_public_key
   VITE_MAPBOX_API_KEY=your_mapbox_api_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
To deploy the app, use:
```sh
npm run build
```
Then host the `dist/` folder on **Vercel, Netlify, or GitHub Pages**.

## Future Enhancements 🚀
- Add **user authentication** for personalized reservations.
- Implement **admin dashboard** for restaurants to manage bookings.
- Enhance **UI/UX** with improved animations and design refinements.

## License
This project is licensed under the **MIT License**.

---

### 🌟 Contributions & Feedback
Feel free to contribute by submitting issues or pull requests! If you have suggestions, reach out via the **Contact Us** form in the app. 🚀

