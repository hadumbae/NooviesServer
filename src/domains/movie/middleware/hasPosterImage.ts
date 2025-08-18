import type {Request, Response, NextFunction} from "express";
import ZodValidatorErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";

import {MovieImageInputSchema} from "../schema/MovieInputSchema.js";

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        req.validatedBody = MovieImageInputSchema.parse(req);
        next();
    } catch (e: any) {
        ZodValidatorErrorHandler(e);
    }
};
