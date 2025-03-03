import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
export const newProduct = TryCatch(async (req, res, next) => {
  const { name, price, stock, category } = req.body;
  const photo = req.file; // not included in NewProductRequestBody interface as this is req.file
  if (!photo) {
    return next(new ErrorHandler("Please add photo", 400));
  }
  if (!name || !price || !stock || !category) {
    return next(new ErrorHandler("Please add all fields", 400));
  }
  await Product.create({
    name,
    price,
    stock,
    category: category.toLowerCase(),
    photo: photo?.path,
  });
  // when new product created invalidate cache
  await invalidateCache({ product: true });
  return res.status(201).json({
    success: true,
    message: "Product created successfully",
  });
});
// // GET LATEST PRODUCT
// export const getLatestProduct = TryCatch(async (req,res,next) => {
//     const products = await Product.find({}).sort({createdAt: -1}).limit(5) // get latest 5 products created in des order
//       return res.status(200).json({
//           success: true,
//           products: products
//       })
//     }
//   );
// GET LATEST PRODUCT USING CACHE : RE-VALIDATE IT WHEN new, update, delete and on ne order because of caching
// ex -> cache store 5 latest prod but when i add 1 new prod then still cache show prev 5 product does not include new one
export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("latest-product")) {
    products = JSON.parse(myCache.get("latest-product"));
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5); // get latest 5 products created in des order
    myCache.set("latest-product", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products: products,
  });
});
// GET ALL CATEGORY: RE-VALIDATE IT WHEN new, update, delete and on ne order because of caching
export const getAllCategory = TryCatch(async (req, res, next) => {
  // const productCategory = await Product.distinct("category")
  let productCategory;
  if (myCache.has("all-category")) {
    productCategory = JSON.parse(myCache.get("all-category"));
  } else {
    productCategory = await Product.distinct("category");
    myCache.set("all-category", JSON.stringify(productCategory));
  }
  return res.status(200).json({
    success: true,
    productCategory: productCategory,
  });
});
// GET ADMIN PRODUCTS : RE-VALIDATE IT WHEN new, update, delete and on ne order because of caching
export const getAdminProduct = TryCatch(async (req, res, next) => {
  // const products = await Product.find({});
  let products;
  if (myCache.has("admin-product")) {
    products = JSON.parse(myCache.get("admin-product"));
  } else {
    products = await Product.find({});
    myCache.set("admin-product", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products: products,
  });
});
// GET SINGLE PRODUCT
export const getSingleProduct = TryCatch(async (req, res, next) => {
  // const product = await Product.findById(req.params.id)
  let product;
  if (myCache.has(`product-${req.params.id}`)) {
    product = JSON.parse(myCache.get(`product-${req.params.id}`));
  } else {
    product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    myCache.set(`product-${req.params.id}`, JSON.stringify(product));
  }
  // if(!product) {
  //     return next(new ErrorHandler("Product not found", 404))
  // }
  return res.status(200).json({
    success: true,
    product,
  });
});
// upload product
export const uploadProduct = TryCatch(async (req, res, next) => {
  // url -> http://localhost:4000/api/v1/product/6744a51a35bb97cc375a13be
  // id ---> 6744a51a35bb97cc375a13be {req.params}
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // if user wants to update photo then a) delete old photo b) after that add new photo
  if (photo) {
    // delete
    rm(product.photo, () => {
      console.log("Old photo deleted");
    });
    // after that update
    product.photo = photo.path;
  }
  if (name) product.name = name; // if name then update name
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  await product.save();
  // when new product updated invalidate cache
  await invalidateCache({ product: true, productId: String(product._id) });
  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});
// DELETE SINGLE PRODUCT
export const deleteSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // delete product photo from upload folder before deleting product
  rm(product.photo, () => {
    console.log("product photo deleted");
  });
  await product.deleteOne();
  // when new product deleted invalidate cache
  await invalidateCache({ product: true, productId: String(product._id) });
  return res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
// SEARCH FILTER
export const searchProduct = TryCatch(async (req, res, next) => {
  console.log("searchProduct api");
  const { search, price, category, sort } = req.query; // search, price, category, sort all are taken from SearchRequestQuery || u can still take it from frontend directly but we made SearchRequestQuery for our convenience
  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const skip = (page - 1) * limit; // if page =2 --> skip = 2-1 * 8 = 1*8 so skip first 8
  const baseQuery = {}; // initially baseQuery is empty and fill it according to filter we got from FE
  // if we got search text from FE
  if (search) {
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  }
  // if we got price from FE
  if (price) {
    baseQuery.price = {
      $lte: Number(price),
    };
  }
  // if we got category from FE
  if (category) {
    baseQuery.category = category;
  }
  // filter
  // const filterProducts = await Product.find({
  //   // name: "afs" // it will find only product that has exact same name === 'afs'
  //   // but if we want prefix and suffix both like afs also give afsha, a, af afs, afs... so for that we use regex
  //   name: {
  //     $regex: search,
  //     $options: "i" // case insensitive--> A or a same
  //   },
  //   // price: 4000 --> it will find out all products have exact same price === 4000
  //   price: {
  //     $lte:Number(price) // price lte --> less than equals to
  //   },
  //   category: category, // category must be exactly same like LAPTOP THEN IT SHOULD EQUALS TO LAPTOP
  // })
  // await 1
  // const Products = await Product.find(baseQuery)
  // .sort(sort && {price: sort === 'asc' ? 1 : -1} // if sort then price sorted by asc 1 else desc -1
  // )
  // .limit(limit) // like the no of proucts in a page
  // .skip(skip) // no of product to skip like 8,16,24...
  // await 2 : to find no of page with or without filter
  // find total products but with filter if filter got from FE
  // const filteredProducts = await Product.find(baseQuery)
  // const totalPage = Math.ceil(filteredProducts.length/limit); // Math.ceil converts 10.1 ->11 and 10.9 -> 11 opposite to floor
  // since we use 2 awiats so 1st await freeze the code until it complete execution and move to 2nd await
  // so as we want to run parallely both await we can use Promise.all to run both parallely
  const productPromise = Product.find(baseQuery)
    .sort(
      sort && { price: sort === "asc" ? 1 : -1 }, // if sort then price sorted by asc 1 else desc -1
    )
    .limit(limit) // like the no of proucts in a page
    .skip(skip);
  // USE PROMISE.ALL
  const [products, filteredProducts] = await Promise.all([
    productPromise, // 0th index : products points to --> productPromise
    Product.find(baseQuery), // 1st idx: filteredProducts --> Product.find(baseQuery)
  ]);
  const totalPage = Math.ceil(filteredProducts.length / limit); // Math.ceil converts 10.1 ->11 and 10.9 -> 11 opposite to floor
  return res.status(200).json({
    success: true,
    products: products,
    totalPage: totalPage,
  });
});
