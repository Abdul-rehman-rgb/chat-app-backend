import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ middleware FIRST
app.use(express.json());
app.use(cookieParser());

// ✅ routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// ✅ serve uploads (for profile photos)
app.use("/uploads", express.static("uploads"));

// ✅ DB connection
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
