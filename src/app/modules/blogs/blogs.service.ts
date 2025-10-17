import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import ApiError from "../../Errors/ApiError";
import httpStatus from "http-status";
import { prisma } from "../../shared/prisma";
import config from "../../../config";
import { generateUniqueSlug } from "../../utils/slugify";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { blogSearchableFields } from "./blogs.constant";
import { JwtPayload } from "jsonwebtoken";

const getBlogs = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, tags, isFeatured } = filters;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
      tags: {
        has: searchTerm,
      },
    });
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    andConditions.push({
      tags: {
        hasSome: tagArray,
      },
    });
  }

  if (isFeatured !== undefined) {
    andConditions.push({
      isFeatured: isFeatured === "true",
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleBlog = async (id: string) => {

  
  const result = await prisma.blog.findUnique({
    where: {
      id: id,
    },
  });
  if (!result) {
    throw new ApiError(404, "Blog Not Found")
  }

  const updatedResult =  await prisma.blog.update({
    where: {
      id: id,
    
 },

    data: {
      views: result.views + 1
    }


  })
  return updatedResult;
};

const createBlog = async (req: Request) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coverimage is required");
  }
  const uploadedResult = await fileUploader.uploadToCloudiary(req.file);

  const admin = await prisma.user.findUnique({
    where: { email: config.ADMIN_EMAIL },
  });



  const slug = await generateUniqueSlug(req.body.blog.title, "blog");

  const blogData = {
    ...req.body.blog,
    authorId: admin?.id,
    coverImage: uploadedResult?.secure_url,
    slug: slug,
  };

  const blog = await prisma.blog.create({
    data: blogData,
  });

  return blog;
};
const updateBlog = async (id: string, req: Request) => {
  const existingBlog = await prisma.blog.findUnique({ where: { id } });
  if (!existingBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  let coverImage = existingBlog.coverImage;

  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudiary(req.file);
    coverImage = uploadedResult?.secure_url as string;
  }

  const updatedData: any = {
    ...req.body.blog,
    coverImage,
  };

  if (req.body.blog?.title && req.body.blog.title !== existingBlog.title) {
    updatedData.slug = await generateUniqueSlug(req.body.blog.title, "blog");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: updatedData,
  });

  return updatedBlog;
};
const deleteBlog = async (id: string) => {
  const existingBlog = await prisma.blog.delete({ where: { id } });
  if (!existingBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  return;
};

export const blogService = {
  createBlog,
  getBlogs,
  updateBlog,
  getSingleBlog,
  deleteBlog
};
