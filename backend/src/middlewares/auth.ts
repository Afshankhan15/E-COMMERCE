// only ADMIN are allowed to access
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
// req.params --> "api/gftsh"
// req.query --> "api?id=gftsh"
export const adminMiddleware = TryCatch(async (req, res, next) => {
  const { id } = req.query; // id received from req.query(FRONT-END)
  if (!id) {
    return next(new ErrorHandler("Missing admin Id", 401));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User does not exist", 401));
  }
  if (user.role !== "admin") {
    return next(new ErrorHandler("user is not admin", 401));
  }
  // if user is admin then call next()
  next();
});
