import type {Request, Response, NextFunction} from "express";
import type {ZodTypeAny} from "zod";
import asyncHandler from "../AsyncHandler.js";
import ZodValidatorErrorHandler from "./ZodValidatorErrorHandler.js";

export default (schema: ZodTypeAny) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedBody = await schema.parseAsync(req.body);
            next();
        } catch (e) {
            return ZodValidatorErrorHandler({res, error: e});
        }
    });