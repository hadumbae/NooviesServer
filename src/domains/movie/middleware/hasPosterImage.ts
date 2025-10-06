import type {Request, Response, NextFunction} from "express";
import ZodValidatorErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";

import {MoviePosterImageInputSchema} from "../schema/MovieInput.schema.js";

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        req.validatedBody = MoviePosterImageInputSchema.parse(req);
        next();
    } catch (e: any) {
        ZodValidatorErrorHandler(e);
    }
};
