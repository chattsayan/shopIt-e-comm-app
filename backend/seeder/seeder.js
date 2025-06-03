import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../models/Product.js";
import products from "./data.js";

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("Products added");

    process.exit();
  } catch (error) {
    console.error("Error seeding products: ", error);
    process.exit();
  }
};

seedProducts();
