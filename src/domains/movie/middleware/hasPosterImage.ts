import type { Request, Response, NextFunction } from "express";
import { MoviePosterImageInputSchema } from "../schema/MovieInput.schema.js";
import handleZodError from "../../../shared/utility/schema/handlers/handleZodError.js";

/**
 * Express middleware that validates an uploaded movie poster image.
 *
 * This middleware:
 * 1. Constructs a temporary request body containing the uploaded file (`req.file`).
 * 2. Validates the body using {@link MoviePosterImageInputSchema}.
 * 3. If validation succeeds, assigns the validated data to `req.validatedBody`.
 * 4. If validation fails, calls {@link handleZodError} to throw a structured Zod validation error.
 *
 * @param req - The Express request object, expected to include `req.file` from Multer middleware.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 *
 * @returns void
 *
 * @example
 * ```ts
 * app.post("/movies/poster", upload.single("file"), validateMoviePoster, (req, res) => {
 *   const { file } = req.validatedBody;
 *   // process the validated movie poster
 * });
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
        handleZodError(e);
    }
};
