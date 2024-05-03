require("dotenv").config();
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";

export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.ORIGEN,
  })
);
//routes
app.use("/api/v1", userRouter);

app.use("/api/v1", courseRouter);
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

app.use(ErrorMiddleware);