import type {Response} from 'express';
import {ZodError} from "zod";
import ZodParseError from "../../../errors/ZodParseError.js";
import {ZodDuplicateIndexError} from "../../../errors/zod/ZodDuplicateIndexError.js";

/**
 * Determines whether an error is a globally handled Zod-related error.
 *
 * @param error - Unknown error instance.
 * @returns `true` if the error is a Zod validation or parsing error.
 */
export const isGlobalZodError = (error: unknown) =>
    error instanceof ZodError || error instanceof ZodParseError;

/**
 * Handles all globally recognized Zod-related errors.
 *
 * Maps validation and parsing failures to appropriate HTTP responses.
 *
 * @param error - The detected Zod-related error.
 * @param res - Express response object.
 *
 * @remarks
 * - `ZodError` → **422**
 * - `ZodParseError` → **422**
 * - `ZodDuplicateIndexError` → **409**
 */
export const handleGlobalZodErrors = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
        const {message, errors} = {
            message: "Validation failed.",
            errors: error.errors
        };

        res.status(422).json({message, errors});
        return;
    }

    if (error instanceof ZodParseError) {
        const {message, errors} = error;

        res.status(422).json({message, errors});
        return;
    }

    if (error instanceof ZodDuplicateIndexError) {
        const {errors, message = "Duplicate Index. Uniqueness violated."} = error.toJSON();

        res.status(409).json({message, errors});
    }
};
