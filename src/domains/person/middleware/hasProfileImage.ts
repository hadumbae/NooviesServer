import type { Request, Response, NextFunction } from "express";
import { PersonProfileImageFileSchema } from "../schema/files/PersonProfileImageFileSchema.js";
import handleZodError from "../../../shared/utility/schema/handlers/handleZodError.js";

/**
 * Express middleware that validates a profile image upload in the request.
 *
 * This middleware:
 * 1. Validates the `req` object using {@link PersonProfileImageFileSchema}.
 * 2. If validation passes, assigns the validated data to `req.validatedBody`.
 * 3. If validation fails, calls {@link handleZodError} to throw a structured validation error.
 *
 * @param req - Express request object, expected to contain a file upload.
 * @param res - Express response object.
 * @param next - Callback to pass control to the next middleware.
 *
 * @returns void
 *
 * @example
 * ```ts
 * app.post("/profile", hasProfileImage, (req, res) => {
 *   const { file } = req.validatedBody;
 *   // process the validated file
 * });
 * ```
 */
export default function hasProfileImage(req: Request, res: Response, next: NextFunction): void {
    try {
        req.validatedBody = PersonProfileImageFileSchema.parse(req);
        next();
    } catch (e: unknown) {
        handleZodError(e);
    }
}
