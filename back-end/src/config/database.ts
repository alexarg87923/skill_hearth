import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};
