import express from "express";
import {
  allCoupons,
  applyDiscount,
  checkoutPayment,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminMiddleware } from "../middlewares/auth.js";
const router = express.Router();
// route -> /api/v1/payment/coupon/new : new coupon
router.post("/coupon/new", adminMiddleware, newCoupon);
router.get("/discount", applyDiscount);
// admin can see all available coupon code
router.get("/coupon/all", adminMiddleware, allCoupons);
// delete coupon : /api/v1/payment/coupon/hje77rre7r7r
router.delete("/coupon/:id", adminMiddleware, deleteCoupon);
// create payment after placed order -> api/v1/payment/create
router.post("/create", checkoutPayment);
export default router;
