import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import onboardingRoutes from "./routes/onboarding.routes"
import postRoutes from "./routes/post.rotues";
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'https://mentor-mentee-frontend-wvgo.vercel.app/'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // If you're using cookies
}));

// Routes
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/onboarding", onboardingRoutes)
app.use("/v1/api/posts", postRoutes);

//Connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
