import { NextFunction, Request, Response, Router } from "express";
import { blogController } from "./blogs.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBlogSchema } from "./blogs.validation";
import { ROlE } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

router.get("/", blogController.getBlogs);

router.post(
  "/",
  auth(ROlE.ADMIN),

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = createBlogSchema.parse(JSON.parse(req.body.data));
    next();
  },

  blogController.createBlog
);

export const blogRoutes = router;
