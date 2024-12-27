import {type ZodTypeAny} from "zod";
import type {Request, Response, NextFunction, RequestHandler} from "express";
import ZodValidatorErrorHandler from "./ZodValidatorErrorHandler.js";

export default (schema: ZodTypeAny): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedBody = schema.parse(req.body);
            next();
        } catch (e) {
            ZodValidatorErrorHandler({res, error: e});
        }
    };