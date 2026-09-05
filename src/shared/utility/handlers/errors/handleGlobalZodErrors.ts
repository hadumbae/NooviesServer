/**
 * @fileoverview Utility functions for identifying and handling global Zod and request validation errors in Express responses.
 */

import type {Response} from 'express';
import {ZodError} from "zod";
import { RequestValidationError } from "@/shared/errors/RequestValidationError";
import {ZodDuplicateIndexError} from "@/shared/errors/zod/ZodDuplicateIndexError";
import {InvalidRequestQueryError} from "../../../errors/InvalidRequestQueryError";

/** Determines whether an error is a globally handled Zod-related or request validation error. */
export const isGlobalZodError = (error: unknown) =>
    error instanceof ZodError ||
    error instanceof RequestValidationError ||
    error instanceof ZodDuplicateIndexError ||
    error instanceof InvalidRequestQueryError;

/** Maps globally recognized Zod and validation errors to their corresponding HTTP responses. */
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
        const payload = {
            statusCode: "422",
            errorCode: "form_validation_failed",
            issue: "Validation Failed",
            description: "Form Validation Failed. Please try again.",
            errors: error.errors
        };

        res.status(422).json(payload);
        return;
    }

    if (error instanceof RequestValidationError) {
        const {message, errors, statusCode = 422} = error;

        res.status(statusCode).json({message, errors});
        return;
    }
};