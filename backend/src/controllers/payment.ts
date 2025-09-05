import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
import { stripe } from "../app.js";
// create payment checkout
export const checkoutPayment = TryCatch(async (req, res, next) => {
  const { amount } = req.body; // total amount of order placed by user
  if (!amount) return next(new ErrorHandler("Please enter amount", 400));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });
  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));
  await Coupon.create({ code: coupon, amount });
  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
  });
});
// DISCOUNT
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) return next(new ErrorHandler("Invalid coupon code", 400));
  return res.status(201).json({
    success: true,
    discount: discount.amount,
  });
});
// AVAILABALE COUPON CODE
export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});
  return res.status(201).json({
    success: true,
    coupons,
  });
});
// DELETE COUPON
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler("Invalid coupon Id", 400));
  await coupon.deleteOne();
  return res.status(201).json({
    success: true,
    message: "coupon deleted successfully",
    deletedCoupon: coupon,
  });
});
