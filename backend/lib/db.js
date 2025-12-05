import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected.");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chatApp",   // yahi best tareeka hai
    });

  } catch (err) {
    console.log("Mongo Error:", err);
  }
};
