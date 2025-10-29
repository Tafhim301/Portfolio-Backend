import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

// Determine upload directory based on environment
const getUploadDir = () => {
  // In production (serverless), use /tmp
  if (process.env.NODE_ENV === "production") {
    return "/tmp";
  }
  // In development, use uploads folder in project root
  const uploadDir = path.join(process.cwd(), "uploads");
  
  // Create uploads directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  
  return uploadDir;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadDir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Configure Cloudinary once
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const uploadToCloudiary = async (file: Express.Multer.File) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.filename,
    });

    // Clean up the temporary file after upload
    await fs.unlink(file.path).catch((err) => {
      console.error("Error deleting temp file:", err);
    });

    return uploadResult;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    
    // Clean up file even if upload fails
    await fs.unlink(file.path).catch((err) => {
      console.error("Error deleting temp file:", err);
    });
    
    throw error;
  }
};

export const fileUploader = { upload, uploadToCloudiary };