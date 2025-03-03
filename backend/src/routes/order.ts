import express from "express";
import { adminMiddleware } from "../middlewares/auth.js";
import {
  allOrder,
  deleteOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  processOrder,
} from "../controllers/order.js";
const router = express.Router();
// route -> /api/v1/order/new : NEW ORDER
router.post("/new", newOrder);
// my order ->  /api/v1/order/my -> http://localhost:4000/api/v1/order/my?id=agsgs
router.get("/my", myOrder);
// all order ->  /api/v1/order/all -> http://localhost:4000/api/v1/order/all?id=agsgs
router.get("/all", adminMiddleware, allOrder);
router
  .route("/:id")
  .get(getSingleOrder) // http://localhost:4000/api/v1/order/6750854194cc76fe9d6d8e0f
  .put(adminMiddleware, processOrder) // http://localhost:4000/api/v1/order/6750854194cc76fe9d6d8e0f?id=agsgs
  .delete(adminMiddleware, deleteOrder);
export default router;
