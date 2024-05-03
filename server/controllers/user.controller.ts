require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendEmail";
import { cookieOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.services";
import cloudinary from "cloudinary";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
//register user
export const registrationUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body as IRegistrationBody;
      //check if email exists
      const isEmailExists = await UserModel.findOne({ email });
      if (isEmailExists) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
        avatar,
      };
      const activationToken = createActivationToken(user);
      const { activationCode } = activationToken;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendEmail({
          email: user.email,
          subject: "Active your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          message: `Please check your email:${user.email} to activate your account!`,
          activationToken: activationToken.token,
          success: true,
        });
      } catch (error: any) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// create activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}
const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return {
    token,
    activationCode,
  };
};

//activate users
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      // check exist user
      const isUserExists = await UserModel.findOne({ email });
      if (isUserExists) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user = await UserModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        message: "User created successfully",
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }
      const user = await UserModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user

export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id;
      redis.del(userId);
      res.status(200).json({
        message: "Logged out successfully",
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const massage = "could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(massage, 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler(massage, 400));
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;
      res.cookie("access_token", accessToken, cookieOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      res.status(200).json({
        message: "Token updated successfully",
        success: true,
        accessToken: accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//get user info

export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// social auth
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = await UserModel.create({
          email,
          name,
          avatar,
        });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);
      if (user && email) {
        const isEmailExists = await UserModel.findOne({ email });
        if (isEmailExists) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }
      if (user && name) {
        user.name = name;
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update user password
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}
export const updateUserPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("Please provide old and new password", 400)
        );
      }
      const userId = req.user?._id;
      console.log(userId);
      const user = await UserModel.findById(req.user?._id).select("+password");
      console.log(user);
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }
      const isPasswordCorrect = await user?.comparePassword(oldPassword);
      if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid old password", 400));
      }
      user.password = newPassword;
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update profile picture
interface IUpdateUserProfile {
  avatar: string;
}
export const updateUserProfile = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;
      const user = await UserModel.findById(userId);
      if (avatar && user) {
        //if user one avatar then call this if
        if (user?.avatar.public_id) {
          //first delete old avatar
          await cloudinary.v2.uploader.destroy(user?.avatar.public_id);
          //then upload new avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          //upload new avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
