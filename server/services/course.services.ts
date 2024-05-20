import { Response, NextFunction } from "express";
import CourseModel from "../models/course.model";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";

//create course

export const createCourse = catchAsyncErrors(
  async (data: any, res: Response, next: NextFunction) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

//get all courses
export const getAllCoursesService = async (res: Response) => {
  try {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All Courses Get",
      courses,
    });
  } catch (err: any) {
    res.status(500).json(err);
  }
};
//delete course -- admin
export const deleteCourseService = async (
  id: string,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await CourseModel.findById(id);
    if (!course) {
      return next(new ErrorHandler("course not found", 400));
    }
    await course?.deleteOne({ id });
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "course deleted",
      course,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
