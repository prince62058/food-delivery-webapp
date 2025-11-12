# 🍕 Cloud Kitchen Web App

A full-stack food delivery web application built with React for the frontend and admin panel, and Node.js/Express for the backend. This project allows users to browse food items, add them to cart, place orders with secure payments via Stripe or Cash on Delivery, and manage their orders. Admins can manage food items, view and update order statuses.

## 🚀 Live Demo

Check out the live application here: [https://food-del-frontend-e4u5.onrender.com/](https://food-del-frontend-e4u5.onrender.com/)

## 📋 Features

### User Features
- **User Authentication**: Register, login, and secure JWT-based authentication.
- **Food Browsing**: Explore a variety of food items categorized by type.
- **Cart Management**: Add, remove, and update items in the cart.
- **Order Placement**: Place orders with options for Stripe payment or Cash on Delivery (COD).
- **Order History**: View past orders and their statuses.
- **Order Verification**: Secure payment verification for Stripe transactions.
- **Order Cancellation**: Cancel orders if still in "Food Processing" status.

### Admin Features
- **Food Management**: Add, list, and remove food items with image uploads.
- **Order Management**: View all orders, update order statuses, cancel or remove orders.
- **Dashboard**: Admin panel for efficient management.

### General Features
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Secure Payments**: Integrated with Stripe for online payments.
- **File Uploads**: Multer for handling food image uploads.
- **Email Notifications**: Nodemailer for user communications (e.g., password reset).
- **Firebase Integration**: For additional authentication or services.
- **CORS Support**: Configured for cross-origin requests.

## 🛠️ Tech Stack

### Frontend (User)
- **React**: UI library for building the user interface.
- **React Router DOM**: For client-side routing.
- **Axios**: HTTP client for API requests.
- **React Toastify**: For notifications.
- **Vite**: Build tool and development server.
- **Firebase**: For authentication and other services.

### Admin Panel
- **React**: UI library for the admin interface.
- **React Router DOM**: For routing in the admin panel.
- **Axios**: For API interactions.
- **React Toastify**: Notifications.
- **Vite**: Build tool.

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Password hashing.
- **Stripe**: Payment processing.
- **Multer**: File upload handling.
- **Nodemailer**: Email sending.
- **Joi**: Input validation.
- **Cookie Parser**: For handling cookies.
- **CORS**: Cross-origin resource sharing.

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Stripe account for payment integration
- Firebase project for authentication (if used)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:4000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`.

### Admin Panel Setup
1. Navigate to the `admin` directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The admin panel will run on `http://localhost:5174` (or next available port).

## 🚀 Usage

1. **Backend**: Ensure the backend server is running to handle API requests.
2. **Frontend**: Access the user-facing app at `http://localhost:5173` to browse food, manage cart, and place orders.
3. **Admin Panel**: Access the admin panel at `http://localhost:5174` to manage food items and orders.
4. **Database**: Make sure MongoDB is connected and running.
5. **Payments**: For Stripe payments, ensure your Stripe keys are configured correctly.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

**Prince Kumar**  
- Email: princekumar5252@gmail.com  
- GitHub: [Your GitHub Profile](https://github.com/prince62058)  
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/prince62058/)

---

*Made with ❤️ for food lovers everywhere.*
