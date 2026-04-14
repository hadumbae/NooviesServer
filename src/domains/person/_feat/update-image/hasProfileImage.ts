/**
 * @fileoverview Express middleware for validating Person profile image uploads.
 * Ensures that the uploaded file meets size and format constraints before processing.
 */

import type {Request, Response, NextFunction} from "express";
import handleZodError from "@shared/utility/schema/handlers/handleZodError";
import {PersonProfileImageFileSchema} from "@domains/person/_feat/validate-submit";

/**
 * Validates the presence and format of an uploaded profile image.
 * @throws {ValidationError} via handleZodError if the file is missing or invalid.
 */
export function hasProfileImage(req: Request, res: Response, next: NextFunction): void {
    try {
        req.validatedBody = PersonProfileImageFileSchema.parse(req);
        next();
    } catch (error: unknown) {
        handleZodError(error);
    }
}