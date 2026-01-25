/**
 * @file handleRequestErrors.ts
 *
 * Express helpers for detecting and responding to
 * request validation errors.
 */

import type {Response} from "express";
import {BadRequestError} from "../../../errors/BadRequestError.js";

/**
 * Type guard for request-related errors.
 *
 * @param error - Unknown error value
 * @returns True if error is a {@link BadRequestError}
 */
export const isRequestError = (error: unknown): error is BadRequestError => {
    return error instanceof BadRequestError;
};

/**
 * Handles known request errors and sends an HTTP response.
 *
 * Currently supports:
 * - {@link BadRequestError} → HTTP 400
 *
 * @param error - Thrown error
 * @param res - Express response object
 */
export const handleRequestErrors = (error: unknown, res: Response) => {
    if (error instanceof BadRequestError) {
        const {errors, message} = error;
        res.status(400).json({message, errors});
    }
};
