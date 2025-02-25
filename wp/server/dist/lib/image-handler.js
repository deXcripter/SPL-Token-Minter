"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const promises_1 = __importDefault(require("fs/promises"));
const app_error_1 = __importDefault(require("./app-error"));
const uploadImage = (req, folder) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new app_error_1.default("No file uploaded", 400);
    const [type, ext] = req.file.mimetype.split("/");
    const filename = `${folder}-${Date.now()}`;
    const path = req.file.path;
    if (type !== "image" || !["jpg", "jpeg", "png"].includes(ext)) {
        yield promises_1.default.unlink(path);
        throw new app_error_1.default("Invalid file type. Please upload an image file.", 400);
    }
    try {
        const image = yield cloudinary_1.default.uploader.upload(path, {
            folder: folder,
            public_id: `${filename}`,
        });
        yield promises_1.default.unlink(path);
        return image.secure_url;
    }
    catch (error) {
        yield promises_1.default.unlink(path);
        throw new app_error_1.default(`Image upload failed: ${error}`, 400);
        // throw new AppError(`Image upload failed: ${error.message}`, 400);
    }
});
exports.uploadImage = uploadImage;
const deleteImage = (folder, imageLink) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const publicId = (_a = imageLink.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
    if (!publicId)
        return;
    const fullPublicId = `${folder}/${publicId}`;
    const result = yield cloudinary_1.default.uploader.destroy(fullPublicId);
    if (result.result !== "ok")
        console.error("Error deleting image:", result);
});
exports.deleteImage = deleteImage;
