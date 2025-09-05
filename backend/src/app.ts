import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware, TryCatch } from "./middlewares/error.js";
import { User } from "./models/user.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import cors from "cors";
import Stripe from "stripe";
// importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import statsRoute from "./routes/stats.js";
import morgan from "morgan";
// config path to the env file: where env file is located
config({
  path: "./.env",
});
const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
connectDB(mongoURI);
export const myCache = new NodeCache(); // RAM/memeory m store hojyga wo data
export const stripe = new Stripe(stripeKey);
const app = express();
// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors()); // by default it is allowed for all origin
app.get("/", (req, res) => {
  res.send("hello");
});
// using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);
// make upload folder static to access the photo
app.use("/uploads", express.static("uploads"));

// last middleware which runs after api
app.use(errorMiddleware); // errorMiddleware Role: Acts as the final catch-all, formatting and sending the response.

app.listen(PORT, () => {
  console.log(`server is working on http://localhost:${PORT}`);
});
// GET  USER
export const getUser = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});
