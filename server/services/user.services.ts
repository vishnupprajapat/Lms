import { Response } from "express";
import { redis } from "../utils/redis";

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
