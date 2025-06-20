import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

// ----- ROUTERS -----
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";

dotenv.config();
const app = express();

// ----- MIDDLEWARE -----
app.use(express.json());
app.use(cookieParser());

// ----- API ROUTES -----
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

// ----- CONNECT TO DATABASE -----
connectDB()
  .then(() => {
    console.log("✅ DB Connection Established...");

    // ----- LISTENING TO SERVER -----
    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 Server is successfully listening to port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed: ", err);
  });
