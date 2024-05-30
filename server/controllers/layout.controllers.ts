import express, { Response, Request, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

//create layout

export const createLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exist`, 400));
      }
      if (type === "Banner") {
        const { image, title, subtitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: { public_id: myCloud.public_id, url: myCloud.secure_url },
          title,
          subtitle,
        };
        await LayoutModel.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await Promise.all(
          faq.map(async (item: any) => {
            return { question: item.question, answer: item.answer };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: FaqItem });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItem = await Promise.all(
          categories.map(async (item: any) => {
            return { title: item.title };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItem,
        });
      }
      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error, 400));
    }
  }
);
//edit layout

export const editLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subtitle } = req.body;

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData?.image.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: { public_id: myCloud.public_id, url: myCloud.secure_url },
          title,
          subtitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData?._id, banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqData: any = await LayoutModel.findOne({ type: "FAQ" });
        const FaqItem = await Promise.all(
          faq.map(async (item: any) => {
            return { question: item.question, answer: item.answer };
          })
        );
        await LayoutModel.findByIdAndUpdate(faqData?._id, {
          type: "FAQ",
          faq: FaqItem,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData: any = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItem = await Promise.all(
          categories.map(async (item: any) => {
            return { title: item.title };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItem,
        });
      }
      res.status(201).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error, 400));
    }
  }
);

//get layout by type

export const getLayoutByType = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error, 400));
    }
  }
);
