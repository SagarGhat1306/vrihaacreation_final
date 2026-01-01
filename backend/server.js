require("dotenv").config();
const express = require("express");
const cors = require("cors");


const connectDB = require("./config/db");
const connectCloudinary  = require("./config/cloudinary");
const userRouter  = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");

const app = express();

// DB connection
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/user' , userRouter)
app.use('/api/product' , productRouter)
app.use('/api/cart' , cartRouter)

app.use('/api/order', orderRouter)
// Test route
app.get("/", (req, res) => {
  res.send("Backend with payments & auth running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
