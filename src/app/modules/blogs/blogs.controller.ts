import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { blogService } from "./blogs.service";
import pick from "../../helper/pick";

const getBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, ["searchTerm", "tags", "isFeatured"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await blogService.getBlogs(filters, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Blogs retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const updateBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.updateBlog(req.params.id,req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  }
);
const toggleIsFeatured = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.toggleIsFeatured(req.params.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "IsFeatured updated successfully",
      data: result,
    });
  }
);
const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.getSingleBlog(req.params.slug);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog retrieved successfully",
      data: result,
    });
  }
);

const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.createBlog(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog Created successfully",
      data: result,
    });
  }
);
const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  const result = await blogService.deleteBlog(req.params.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  }
);

export const blogController = {
  createBlog,
  getBlogs,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  toggleIsFeatured
};

