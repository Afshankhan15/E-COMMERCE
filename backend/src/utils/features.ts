import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = (uri) => {
  mongoose
    .connect(uri, {
      dbName: "Ecommerce",
    })
    .then((c) => {
      console.log(`DB Conected to ${c.connection.host}`);
    })
    .catch((error) => {
      console.log(error);
    });
};
// cache will delete data when new product created , updated and deleted
export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}) => {
  if (product) {
    // cache will delete data when new product created , updated and deleted
    const productKeys = ["latest-product", "all-category", "admin-product"];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));
    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
    myCache.del(orderKeys);
  }
  //
  if (admin) {
  }
};
// reduce stock
export const reduceStock = async (orderItems) => {
  console.log("order items --->", orderItems);
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    await product.save();
  }
};
