import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";




const app = express();
const server = http.createServer(app);

// Midddlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Status route
app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is live" });
});




//Connect to MONGODB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
    });
