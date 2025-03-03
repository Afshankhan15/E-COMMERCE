import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
// REGISTER/LOGIN
export const newUser = TryCatch(
  async (
    req,
    //   req: Request,
    res,
    next,
  ) => {
    //  return next(new Error("mera error"));
    // return next(new ErrorHandler("mera custom errir", 401))
    const { name, email, photo, gender, _id, dob } = req.body;
    console.log(name, email, photo, gender, _id, dob);
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `welcome ${user.name}`,
      });
    }
    if (!name || !email || !photo || !gender || !_id || !dob) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  },
);
// GET ALL USERS
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});
// GET USER
export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("Invalid Id", 400));
  }
  return res.status(200).json({
    success: true,
    user,
  });
});
// DELETE USER
export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("Invalid Id", 400));
  }
  await user.deleteOne();
  return res.status(200).json({
    success: true,
    message: `${user.name} Deleted successfully`,
  });
});
