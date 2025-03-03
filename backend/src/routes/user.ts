import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  newUser,
} from "../controllers/user.js";
import { adminMiddleware } from "../middlewares/auth.js";
const router = express.Router();
// route -> /api/v1/user/new : REGISTER/LOGIN USER
router.post("/new", newUser);
// to get all user -> http://localhost:4000/api/v1/user/all?id=agsgs
router.get("/all", adminMiddleware, getAllUsers);
// to get single user by ID -> /api/v1/user/new/ID
// router.get("/:id", getUser)
// to delete user by ID -> /api/v1/user/new/ID
// router.delete("/:id", deleteUser)
// you can do chain if url same
router.route("/:id").get(getUser).delete(adminMiddleware, deleteUser);
export default router;
