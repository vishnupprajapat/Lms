require("dotenv").config();
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import rateLimit from "express-rate-limit";
// import { rateLimit } from "express-rate-limit";
export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: ["https://lms-api-nine.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // store: ... , // Redis, Memcached, etc. See below.
});

//routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);
// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Api is Working",
    success: true,
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`) as any;
  err.status = 404;
  next(err);
});
app.use(limiter);
app.use(ErrorMiddleware);
