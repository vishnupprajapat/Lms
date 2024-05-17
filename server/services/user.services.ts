import { Response } from "express";
import { redis } from "../utils/redis";
import UserModel from "../models/user.model";

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
