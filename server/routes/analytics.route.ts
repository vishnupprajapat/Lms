import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controllers";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/user-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics
);
analyticsRouter.get(
  "/courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCourseAnalytics
);
analyticsRouter.get(
  "/orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);
export default analyticsRouter;
