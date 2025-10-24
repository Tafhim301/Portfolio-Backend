import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { ROlE } from "@prisma/client";

const router = Router();

router.post('/login',authController.login);
router.post('/logout',authController.logOut);
router.get('/user',auth(),authController.userInfo);

export const authRoutes = router;