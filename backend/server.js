require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");


const connectDB = require("./config/db");
const connectCloudinary  = require("./config/cloudinary");

const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const categoryRouter = require("./routes/categoryRoute");
const analyticsRouter = require("./routes/analyticsRoute");

const app = express();

// DB connection
connectDB();
connectCloudinary();

// middleware — compression + json body keep responses fast for 500 concurrent users
app.use(compression());
app.use(express.json({ limit: "2mb" }));

const allowedOrigins = [
  "https://vrihaacreation-frontend.vercel.app",

  "https://vrihaacreation-adminpanel.vercel.app",
  
  "http://localhost:5173",
  "http://localhost:5174"
];
// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
}));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/category", categoryRouter);
app.use("/api/analytics", analyticsRouter);
// Test route
app.get("/", (req, res) => {
  res.send("Backend with payments & auth running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
