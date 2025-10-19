import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await authService.login(req.body);

    const { accessToken, refreshToken, user } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Logged in successfully",
      data: {
        user,
      },
    });
  }
);
const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken')






    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
      data: null
    });
  }
);
const userInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await authService.userInfo(req.user)








    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: result
    });
  }
);



export const authController = {
  login,
  logOut,
  userInfo
};
