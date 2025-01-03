import multer, {type FileFilterCallback} from "multer";
import {type Request} from "express";
import createHttpError from "http-errors";
import ImageTypeConstant from "../constants/ImageTypeConstant.js";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ImageTypeConstant.includes(file.mimetype as any)) {
        cb(null, true);
    } else {
        const error = createHttpError(400, "Invalid File Type.");
        cb(error);
    }
};

export const upload = multer({storage, fileFilter});