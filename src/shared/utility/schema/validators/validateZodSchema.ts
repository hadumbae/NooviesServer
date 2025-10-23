import { type ZodTypeAny } from "zod";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import handleZodError from "../handlers/handleZodError.js";

/**
 * Factory function that creates an Express middleware for validating request bodies using a Zod schema.
 *
 * This middleware:
 * 1. Parses and validates `req.body` against the provided Zod schema.
 * 2. If validation succeeds, attaches the validated data to `req.validatedBody`.
 * 3. If validation fails, logs the failed request body to the console and calls {@link handleZodError} to throw a structured error.
 *
 * @param schema - A Zod schema used to validate the request body.
 * @returns An Express {@link RequestHandler} middleware function.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { movieSchema } from "./schemas/movieSchema";
 * import validateBody from "./middleware/validateBody";
 *
 * const app = express();
 * app.post("/movies", validateBody(movieSchema), (req, res) => {
 *   const validatedData = req.validatedBody;
 *   // handle validated movie data
 * });
 * ```
 */
export default (schema: ZodTypeAny): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedBody = schema.parse(req.body);
            next();
        } catch (e: any) {
            console.debug("Failed Request Body: ", req.body);
            handleZodError(e);
        }
    };
