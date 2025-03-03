import express from "express";
import {
  deleteSingleProduct,
  getAdminProduct,
  getAllCategory,
  getLatestProduct,
  getSingleProduct,
  newProduct,
  searchProduct,
  uploadProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminMiddleware } from "../middlewares/auth.js";
const router = express.Router();
// add new product
router.post("/new", adminMiddleware, singleUpload, newProduct); // http://localhost:4000/api/v1/product/new?id=agsgs
// get latest 5 product
router.get("/latest", getLatestProduct);
// SEARCH PRODUCT USING FILTER
router.get("/filter", searchProduct); // http://localhost:4000/api/v1/product/filter?search=afs&price=89999&category=laptop
// GET ALL UNIQUE CATEGORES --> LAPTOP, MOBILE ETC
router.get("/category", getAllCategory);
// admin products ---> to extract all products
// bcz of adminMiddleware the id is given on router.query---> http://localhost:4000/api/v1/product/admin-products?id=agsgs
router.get("/admin-products", adminMiddleware, getAdminProduct);
// we use singleUpload to upload files/photos
router
  .route("/:id")
  .get(getSingleProduct) // http://localhost:4000/api/v1/product/6744b9690e5ccb69570bcf7e
  .put(adminMiddleware, singleUpload, uploadProduct) // http://localhost:4000/api/v1/product/6744b9690e5ccb69570bcf7e?id=agsgs
  .delete(adminMiddleware, deleteSingleProduct);
export default router;
