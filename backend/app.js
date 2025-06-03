import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Routers
import productRoutes from "./routes/products.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ----- API Routes -----
app.use("/api/v1", productRoutes);

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
