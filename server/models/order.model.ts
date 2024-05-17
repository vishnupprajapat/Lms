require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}
const OrderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OrderModel: Model<IOrder> = mongoose.model("Order", OrderSchema);
export default OrderModel;
