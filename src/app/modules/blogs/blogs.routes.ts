import { Router } from "express";
import { blogController } from "./blogs.controller";
import { validateFormDataRequest } from "../../middlewares/validateRequest";
import { createBlogSchema, updateBlogSchema } from "./blogs.validation";
import { ROlE } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getSingleBlog);
router.post(
  "/",
  auth(ROlE.ADMIN),
  fileUploader.upload.single("file"),
  validateFormDataRequest(createBlogSchema),

  blogController.createBlog
);
router.patch(
  "/:id",
  auth(ROlE.ADMIN),
  fileUploader.upload.single("file"),
  validateFormDataRequest(updateBlogSchema),
  blogController.updateBlog
);
router.patch("/toggleIsFeatured/:id",auth(ROlE.ADMIN),blogController.toggleIsFeatured)

router.delete('/:id',auth(ROlE.ADMIN),blogController.deleteBlog)

export const blogRoutes = router;
