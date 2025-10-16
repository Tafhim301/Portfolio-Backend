import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { blogRoutes } from "../modules/blogs/blogs.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/blogs",
    route: blogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
