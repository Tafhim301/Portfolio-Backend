import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import ApiError from "../../Errors/ApiError";
import httpStatus from "http-status";
import { prisma } from "../../shared/prisma";
import config from "../../../config";
import { generateUniqueSlug } from "../../utils/slugify";

const createBlog = async (req: Request) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coverimage is required");
  }
  const uploadedResult = await fileUploader.uploadToCloudiary(req.file);

   

  const admin = await prisma.user.findUnique({
    where: { email: config.ADMIN_EMAIL },
  });

  console.log(req.body)

  const slug = await generateUniqueSlug(req.body.blog.title, "blog");

  const blogData = {
    ...req.body.blog,
    authorId: admin?.id,
    coverImage : uploadedResult?.secure_url,
    slug: slug,
  };



    const blog = await prisma.blog.create({
      data: blogData,
    });

  return blog;
};

export const blogService = {
  createBlog,
};
