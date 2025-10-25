import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { projectService } from "./projects.service";
import sendResponse from "../../shared/sendResponse";

const uploadProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await projectService.uploadProject(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Project Created successfully",
      data: result,
    });
  }
);
const getAllProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await projectService.getAllProjects();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Projects retrieved successfully",
      data: result,
    });
  }
);
const getSingleProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await projectService.getSingleProject(req.params.slug);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project retrieved successfully",
      data: result,
    });
  }
);
const updateProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await projectService.updateProject(req,req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  }
);
const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const result = await projectService.deleteProject(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project deleted successfully",
      data: result,
    });
  }
);


export const projectsController = {
  uploadProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  updateProject

}