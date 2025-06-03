import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

export default connectDB;
