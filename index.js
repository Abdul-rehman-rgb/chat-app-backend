import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIXED: Trailing slash hata diya aur options add kiye
const allowedOrigins = [
  "https://chat-app-frontend-nu-ruddy.vercel.app", // Slash nahi hona chahiye
  "http://localhost:5173" // Local development ke liye
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/uploads", express.static("uploads"));

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});