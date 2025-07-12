import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import onboardingRoutes from "./routes/onboarding.routes";
import postRoutes from "./routes/post.rotues";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------
 *  CORS  – **one** call, with full options
 * ----------------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://mentor-mentee-frontend-wvgo.vercel.app",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server‑to‑server with no Origin header
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed for this origin"));
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  }),
);

// explicit OPTIONS fallback (just in case)
app.options("*", cors());

/* -------------------------------------------------------------
 *  Parsers
 * ----------------------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------
 *  Routes
 * ----------------------------------------------------------- */
app.use("/v1/api/auth",        authRoutes);
app.use("/v1/api/onboarding",  onboardingRoutes);
app.use("/v1/api/posts",       postRoutes);

/* -------------------------------------------------------------
 *  Mongo + start
 * ----------------------------------------------------------- */
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀  Server running at http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
