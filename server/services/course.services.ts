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
