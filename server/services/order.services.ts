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

//get all orders ----- only for admin
export const getAllOrdersService = async (res: Response) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All Order Get",
      orders,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
