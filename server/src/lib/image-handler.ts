import { Request } from "express";
import cloudinary from "./cloudinary";
import fs from "fs/promises";
import AppError from "./app-error";

const uploadImage = async (
  req: Request,
  folder: string
): Promise<string | AppError> => {
  if (!req.file) throw new AppError("No file uploaded", 400);

  const [type, ext] = req.file.mimetype.split("/");
  const filename = `${folder}-${Date.now()}`;
  const path = req.file.path;

  if (type !== "image" || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
    await fs.unlink(path);
    throw new AppError("Invalid file type. Please upload an image file.", 400);
  }

  try {
    const image = await cloudinary.uploader.upload(path, {
      folder: folder,
      public_id: `${filename}`,
    });
    await fs.unlink(path);
    return image.secure_url;
  } catch (error: any) {
    await fs.unlink(path);
    throw new AppError(`Image upload failed: ${error}`, 400);
  }
};

const deleteImage = async (folder: string, imageLink: string) => {
  const publicId = imageLink.split("/").pop()?.split(".")[0];
  if (!publicId) return;

  const fullPublicId = `${folder}/${publicId}`;
  const result = await cloudinary.uploader.destroy(fullPublicId);

  if (result.result !== "ok") console.error("Error deleting image:", result);
};

export { uploadImage, deleteImage };
