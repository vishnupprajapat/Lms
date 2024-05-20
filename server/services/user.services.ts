import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import UserModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

//get user by id
export const getUserById = async (id: string, res: Response) => {
  try {
    const userJson = await redis.get(id);
    if (userJson) {
      const user = JSON.parse(userJson);
      return res.status(200).json({
        success: true,
        message: "User found",
        user,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all users
export const getAllUsersService = async (res: Response) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All User Get",
      users,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

//update user role --- only for admin
export const updateUserRoleService = async (
  id: string,
  role: string,
  res: Response
) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        role,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User role updated",
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
// delete user --- only for admin
export const deleteUserService = async (
  id: string,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    await user?.deleteOne({ id });
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "User deleted",
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
