import type {Request, Response, NextFunction} from "express";
import ZodValidatorErrorHandler from "../../../shared/utility/zod/ZodParseErrorHandler.js";
import {MoviePosterImageInputSchema} from "../schema/MovieInput.schema.js";

/**
 * Middleware that validates incoming movie poster image upload requests.
 *
 * @description
 * This middleware ensures that the uploaded file in the request matches
 * the expected schema defined by `MoviePosterImageInputSchema`.
 *
 * - Extracts the uploaded file from `req.file`.
 * - Validates the structure using Zod.
 * - On success, attaches the validated data to `req.validatedBody`.
 * - On validation failure, passes the error to `ZodValidatorErrorHandler`.
 *
 * @param req - Express request object, expected to contain a `file` property from multer or similar middleware
 * @param res - Express response object
 * @param next - Express next function to continue middleware chain
 *
 * @example
 * ```ts
 * import express from "express";
 * import uploadPosterValidator from "./middleware/uploadPosterValidator.js";
 *
 * const router = express.Router();
 *
 * router.post(
 *   "/poster",
 *   upload.single("file"),
 *   uploadPosterValidator,
 *   (req, res) => {
 *     res.json({ success: true, data: req.validatedBody });
 *   }
 * );
 * ```
 */
export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestBody = {
            file: req.file,
        };

        req.validatedBody = MoviePosterImageInputSchema.parse(requestBody);
        next();
    } catch (e: any) {
        ZodValidatorErrorHandler(e);
    }
};
