import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ DB Connected successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🚨 MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB connection disconnected.");
    });

    // Graceful shutdown on termination signals
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed due to application termination.");
        process.exit(0);
      } catch (closeErr) {
        console.error("Error closing MongoDB connection:", closeErr);
        process.exit(1);
      }
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chatApp",
    });

  } catch (err) {
    console.error("🚨 Failed to connect to MongoDB:", err);
  }
};
