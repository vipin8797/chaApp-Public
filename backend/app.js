import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";




const app = express();
const server = http.createServer(app);

// Midddlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is live" });
});
app.use("/api/aut",userRouter);



//Connect to MONGODB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
    });
