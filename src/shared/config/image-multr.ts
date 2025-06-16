import multer, {type FileFilterCallback} from "multer";
import {type Request} from "express";
import createHttpError from "http-errors";
import ImageTypeConstant from "../constants/ImageTypeConstant.js";

/**
 * A Set of allowed MIME types for uploaded image files.
 *
 * Values are taken from `ImageTypeConstant`, which is a readonly array of supported image MIME strings,
 * e.g., "image/jpeg", "image/png", "image/webp", etc.
 */
const ALLOWED_IMAGE_TYPES = new Set<string>(ImageTypeConstant);

/**
 * Multer storage engine configured to keep uploaded files in memory (RAM) instead of writing to disk.
 *
 * This is suitable for temporary use cases, such as uploading to a cloud service (e.g. Cloudinary or S3)
 * immediately after file reception.
 */
const storage = multer.memoryStorage();

/**
 * Multer configuration object that sets the maximum allowed file size.
 *
 * @property fileSize - Maximum file size in bytes. Here, it is set to 5 MB.
 */
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
};

/**
 * Custom file filter used by Multer to validate uploaded file MIME types.
 *
 * - Accepts only files whose MIME type exists in the `ALLOWED_IMAGE_TYPES` set.
 * - Rejects others with a 400 Bad Request error using `createHttpError`.
 *
 * @param req - The Express request object.
 * @param file - The uploaded file metadata.
 * @param cb - Multer callback to indicate acceptance or rejection of the file.
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
        cb(null, true);
    } else {
        const error = createHttpError(400, `Invalid File Type: ${file.mimetype}`);
        cb(error);
    }
};

/**
 * A configured Multer instance used to handle file uploads.
 *
 * - Stores files in memory using `memoryStorage`.
 * - Filters files using the `fileFilter` function.
 * - Enforces a 5MB file size limit via `limits`.
 */
export const uploadImage = multer({
    storage,
    fileFilter,
    limits,
});