/**
 * @fileoverview Middleware to validate the presence and format of a genre image upload.
 */

import type {NextFunction, Request, Response} from "express";
import {GenreImageInputSchema} from "@domains/genre/_feat/manage-image/schema/GenreImageInputSchema";
import {RequestValidationError} from "@shared/errors/RequestValidationError";

/**
 * Validates the uploaded file against the GenreImageInputSchema and attaches the result to the request. */
export function hasGenreImage(req: Request, res: Response, next: NextFunction) {
    const requestBody = {image: req.file};
    const {data, success, error} = GenreImageInputSchema.safeParse(requestBody);

    if (!success) {
        throw new RequestValidationError({
            errors: error.errors,
            raw: requestBody,
            message: "Invalid Genre Image Upload."
        });
    }

    req.validatedBody = data;

    next();
}