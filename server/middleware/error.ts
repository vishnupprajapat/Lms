import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || `Internal server error`;

  // wrong mongo db id error
  if (err.name === "CastError") {
    const message = `Resource not found invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //duplicate key error
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue)[0];
    const message = `${value} already exists`;
    err = new ErrorHandler(message, 400);
  }
  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is  Invalid ,try again`;
    err = new ErrorHandler(message, 400);
  }
  //jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is   expired`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
