import type {Request, Response, NextFunction} from "express";
import ZodValidatorErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";
import {MovieImageSchema} from "../schema/MovieImageSchema.js";

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        req.validatedBody = MovieImageSchema.parse(req);
        next();
    } catch (e: any) {
        ZodValidatorErrorHandler(e);
    }
};
