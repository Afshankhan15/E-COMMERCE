import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const newOrder = TryCatch(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = req.body;
  console.log(
    "ALL FILEDS",
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    total,
  );
  if (
    !shippingInfo ||
    !orderItems ||
    !user ||
    !subtotal ||
    !tax ||
    //   !shippingCharges ||
    //   !discount ||
    !total
  ) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Validate products exist and have sufficient stock
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new ErrorHandler(`Product not found: ${item.productId}`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new ErrorHandler(`Insufficient stock for ${product.name}`, 400));
    }
  }
  const order = await Order.create({
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  });
  // after order is placed by user then product stock will get reduced by the no. of product ordered by user
  await reduceStock(orderItems);
  // when new order created invalidate cache bzc it reduce no of product stock/quantity
  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: user,
    productId: order.orderItems.map((i) => String(i.productId)),
  });
  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
  });
});
export const myOrder = TryCatch(async (req, res, next) => {
  const id = req.query.id;
  let orders = [];
  const key = `my-orders-${id}`;
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key));
  } else {
    orders = await Order.find({ user: id }); // order model has user key which stores user_id
    myCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders: orders,
  });
});
// ALL ORDERS
export const allOrder = TryCatch(async (req, res, next) => {
  const key = `all-orders`;
  let orders = [];
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key));
  } else {
    // orders = await Order.find(); // it is show order but in key "user" : "agsgs" it show user id but we want user name so populate user model
   
    orders = await Order.find().populate("user", "name"); // now it will show id and name both if u wriye "user" only then entire user object
    
   
  // .populate("orderItems.productId", "name price photo");
console.log(JSON.stringify(orders, null, 2))

    myCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders: orders,
  });
});
// GET SINGLE ORDER
export const getSingleOrder = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const key = `order-${id}`;
  let order;
  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key));
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not found", 404));
    myCache.set(key, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order: order,
  });
});
// UPDATE -> process order
export const processOrder = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order not found", 404));
  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }
  await order.save();
  // after product gets updated then it does not affect product collection
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "Order proccessed successfully",
  });
});
// DELETE ORDER
export const deleteOrder = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order not found", 404));
  await order.deleteOne();
  // after product gets deleted then it does not affect product collection
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "Order Deleted successfully",
  });
});
