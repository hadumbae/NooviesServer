/**
 * @fileoverview Middleware for validating movie poster image uploads.
 */

import type {NextFunction, Request, Response} from "express";
import {MoviePosterImageInputSchema} from "./MoviePosterImageInputSchema";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";

/**
 * Validates an uploaded movie poster file against the input schema and attaches it to the request.
 */
export function hasPosterImage(req: Request, res: Response, next: NextFunction): void {
    const requestBody = {image: req.file};
    const {data, success, error} = MoviePosterImageInputSchema.safeParse(requestBody);

    if (!success) {
        throw new RequestValidationError({
            errors: error.errors,
            raw: requestBody,
            message: "Invalid Movie Poster Image Upload."
        });
    }

    req.validatedBody = data;
    next();
}
