import type {Response} from 'express';
import {ZodError} from "zod";
import { RequestValidationError } from "@shared/errors/RequestValidationError";
import {ZodDuplicateIndexError} from "@shared/errors/zod/ZodDuplicateIndexError";
import InvalidRequestQueryError from "../../../errors/InvalidRequestQueryError";

/**
 * Determines whether an error is a globally handled Zod-related error.
 *
 * @param error - Unknown error instance.
 * @returns `true` if the error is a Zod validation or parsing error.
 */
export const isGlobalZodError = (error: unknown) =>
    error instanceof ZodError ||
    error instanceof RequestValidationError ||
    error instanceof ZodDuplicateIndexError ||
    error instanceof InvalidRequestQueryError;

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
    if (error instanceof InvalidRequestQueryError) {
        const {
            errorType,
            message = "[INVALID] Malformed Query Options",
            model,
            errors,
        } = error.toJSON();

        res.status(400).json({errorType, message, model, errors});
    }

    if (error instanceof ZodDuplicateIndexError) {
        const {errors, message = "Duplicate Index. Uniqueness violated."} = error.toJSON();

        res.status(409).json({message, errors});
    }

    if (error instanceof ZodError) {
        const {message, errors} = {
            message: "Validation failed.",
            errors: error.errors
        };

        res.status(422).json({message, errors});
        return;
    }

    if (error instanceof RequestValidationError) {
        const {message, errors} = error;

        res.status(422).json({message, errors});
        return;
    }
};
