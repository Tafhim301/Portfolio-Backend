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

const createBlog = async (req: Request) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coverimage is required");
  }
  const uploadedResult = await fileUploader.uploadToCloudiary(req.file);

  const admin = await prisma.user.findUnique({
    where: { email: config.ADMIN_EMAIL },
  });

  console.log(req.body);

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

export const blogService = {
  createBlog,
  getBlogs,
};
