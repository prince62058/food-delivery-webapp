import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import foodRouter from './routes/foodRoutes.js';
import { connectDb } from './config/db.js';
import useRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:5173","https://food-delivery-admin-5it0.onrender.com","https://food-del-frontend-e4u5.onrender.com","http://localhost:5174", "http://localhost:5175"], // React frontend and admin
  credentials: true, // allow cookies
}));

// ✅ Database connection
connectDb();

// ✅ Set mongoose options
mongoose.set('overwriteModels', true);

// ✅ Serve static files
app.use('/images', express.static('uploads'));

// ✅ API routes
app.use('/api/food', foodRouter);
app.use('/api/user', useRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter);

// ✅ Root route
app.get('/', (req, res) => {
  res.send("App is working");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
