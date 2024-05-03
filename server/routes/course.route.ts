import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  editCourse,
  getAllCourse,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const userRouter = express.Router();

userRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
userRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
userRouter.get("/get-course/:id", getSingleCourse);
userRouter.get("/get-all-course", getAllCourse);
export default userRouter;
