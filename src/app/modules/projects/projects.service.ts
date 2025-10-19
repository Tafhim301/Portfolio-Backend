import { Request } from "express";
import ApiError from "../../Errors/ApiError";
import httpStatus from "http-status";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { generateUniqueSlug } from "../../utils/slugify";

interface MulterFiles {
  thumbnail?: Express.Multer.File[];
  demoImages?: Express.Multer.File[];
}

interface ProjectRequestBody {
  project: {
    title: string;
    description: string;
    liveUrl: string;
    repoUrl: string;
    features: string[];
  };
}

const uploadProject = async (req: Request<{}, {}, ProjectRequestBody, {}> & { files?: MulterFiles }) => {

  const thumbnailFile = req.files?.thumbnail?.[0];
  if (!thumbnailFile) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Thumbnail is required");
  }

  const uploadedThumbnail = await fileUploader.uploadToCloudiary(thumbnailFile);


  const demoImageFiles = req.files?.demoImages || [];
  const demoImageUrls = await Promise.all(
    demoImageFiles.map(async (file) => {
      const uploaded = await fileUploader.uploadToCloudiary(file);
      return uploaded?.secure_url;
    })
  );

  const slug = await generateUniqueSlug(req.body.project.title, "project");


  const projectData = {
    ...req.body.project,
    thumbnail: uploadedThumbnail?.secure_url as string,
    slug,
    demoImages: demoImageUrls as string[],
  };


  const project = await prisma.project.create({
    data: projectData,
  });

  return project;
};


const getAllProjects = async () => {
  const result = await prisma.project.findMany();

  return result
}

const getSingleProject = async (slug : string) => {
  const result = await prisma.project.findUnique({
    where : {
      slug : slug
    }
  });

  if(!result){
    throw new ApiError(404,"Project not found")
  }

  return result
}
const deleteProject = async (id : string) => {
  const result = await prisma.project.delete({
    where : {
      id : id
    }
  });

  return result
}



export const projectService = {
  uploadProject,
  getAllProjects,
  getSingleProject,
  deleteProject
};
