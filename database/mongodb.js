import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} environment`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
