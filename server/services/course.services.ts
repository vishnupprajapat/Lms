import { Response, NextFunction } from "express";
import CourseModel from "../models/course.model";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";

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
  } catch (err) {
    res.status(500).json(err);
  }
};
