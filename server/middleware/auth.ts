require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//authenticated user

export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    if (!access_token) {
      return next(new ErrorHandler("Not authorized", 401));
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 401));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("user not found", 401));
    }
    req.user = JSON.parse(user);
    next();
  }
);
//validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role || ""} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
