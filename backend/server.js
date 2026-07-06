require("dotenv").config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");

const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const categoryRouter = require("./routes/categoryRoute");
const analyticsRouter = require("./routes/analyticsRoute");

const app = express();

// ---------------------
// Database Connections
// ---------------------
connectDB();
connectCloudinary();

// ---------------------
// Allowed Origins
// ---------------------
const allowedOrigins = [
  "https://vrihaacreation-frontend.vercel.app",
  "https://vrihaacreation-adminpanel.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

// ---------------------
// Middlewares
// ---------------------
app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token", // IMPORTANT: allow your custom token header
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json({ limit: "2mb" }));

// ---------------------
// Logger
// ---------------------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------
// Routes
// ---------------------
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/category", categoryRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("Backend with payments & auth running 🚀");
});

// ---------------------
// 404
// ---------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------------------
// Error Handler
// ---------------------
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---------------------
// Export for Vercel
// ---------------------
module.exports = app;

// Run locally only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}