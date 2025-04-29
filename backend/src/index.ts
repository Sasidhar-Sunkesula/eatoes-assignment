import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectMongoDB } from "./db/mongoose";
import menuRouter from "./routes/menu";
import ordersRouter from "./routes/orders";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  clerkMiddleware({
    clockSkewInMs: 10000,
  })
);

// Routes
app.use("/api", menuRouter);
app.use("/api", ordersRouter);

// Start the server only after connecting to MongoDB
app.listen(PORT, async () => {
  try {
    await connectMongoDB(process.env.MONGODB_URI!);
    console.log("Server is running on port", PORT);
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
});
