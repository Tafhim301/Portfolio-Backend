import { Router } from "express";
import { projectsController } from "./projects.controller";
import { validateFormDataRequest } from "../../middlewares/validateRequest";
import { createProjectSchema } from "./project.validation";
import { fileUploader } from "../../helper/fileUploader";
import { auth } from "../../middlewares/auth";
import { ROlE } from "@prisma/client";





const router = Router();

router.get('/', projectsController.getAllProjects)

router.get('/:slug', projectsController.getSingleProject)
router.delete('/:id', projectsController.deleteProject)


router.post(
  "/",
  auth(ROlE.ADMIN),
  fileUploader.upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "demoImages", maxCount: 10 },
  ]),
  validateFormDataRequest(createProjectSchema),
  projectsController.uploadProject
);

export const projectsRoutes = router;
