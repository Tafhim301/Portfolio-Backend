import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body);
    const { accessToken, refreshToken } = result;

    
    const cookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: 'none' as const,
      path: '/',
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const cookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: 'none' as const,
      path: '/',
    };

    // Clear both access and refresh tokens
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

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
    const result = await authService.userInfo(req.user);

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