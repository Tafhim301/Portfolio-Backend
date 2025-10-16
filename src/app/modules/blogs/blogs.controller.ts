import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { blogService } from "./blogs.service";


const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await blogService.createBlog(req);


    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog Created successfully",
      data: result
    });
  }
);

export const  blogController = {
  createBlog,
};
