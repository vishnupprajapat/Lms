require("dotenv").config();
import express, { Response, Request, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notification.model";
import corn from "node-cron";

//get all notification ---- only for admin

export const getNotifications = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update notification status ---- only for admin

export const updateNotification = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    } else {
      notification.status
        ? (notification.status = "read")
        : notification.status;
    }
    await notification.save();
    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      notifications,
    });

    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete notification with cron job --- only admin
corn.schedule("0 0 0 * * *", async () => {
  const thirtyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDayAgo },
  });
  console.log("Deleted read notification");
});
