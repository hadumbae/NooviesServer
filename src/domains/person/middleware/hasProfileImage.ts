import type {Request, Response, NextFunction} from "express";
import ZodValidatorErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";
import {PersonProfileImageFileSchema} from "../schema/files/PersonProfileImageFileSchema.js";

export default function hasProfileImage(req: Request, res: Response, next: NextFunction) {
    try {
        req.validatedBody = PersonProfileImageFileSchema.parse(req);
        next();
    } catch (e: any) {
        ZodValidatorErrorHandler(e);
    }
}