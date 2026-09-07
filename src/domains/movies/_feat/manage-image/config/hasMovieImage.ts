/**
 * @fileoverview Express middleware for validating movie image upload requests using Zod schema.
 */

import type {NextFunction, Request, Response} from "express";
import {MovieImageInputSchema} from "@/domains/movies/_feat/manage-image/config/MovieImageInputSchema";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";

/**
 * Validates that an uploaded movie image file exists and meets schema constraints.
 */
export function hasMovieImage(req: Request, res: Response, next: NextFunction): void {
    const requestBody = {image: req.file};
    const {data, success, error} = MovieImageInputSchema.safeParse(requestBody);

    if (!success) {
        throw new RequestValidationError({
            errors: error.errors,
            raw: requestBody,
            message: "Invalid Movie Image Upload."
        });
    }

    req.validatedBody = data;
    next();
}