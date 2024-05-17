import { Response, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";
//create new order
export const newOrder = catchAsyncErrors(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  }
);
