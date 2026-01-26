import type {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {isHttpError} from "http-errors";
import {handleGlobalZodErrors, isGlobalZodError} from "./errors/handleGlobalZodErrors.js";
import {handleGlobalMongooseErrors, isGlobalMongooseError} from "./errors/handleGlobalMongooseErrors.js";
import {handleRequestErrors, isRequestError} from "./errors/handleRequestErrors.js";
import {handleBookingError, isBookingError} from "./errors/handleBookingErrors.js";

/**
 * @file handleGlobalErrors.ts
 *
 * Global Express error-handling middleware.
 *
 * @remarks
 * Acts as the final error boundary for all API routes.
 * Detects known domain and infrastructure errors and delegates
 * response handling to specialized handlers.
 *
 * Fallback behavior:
 * - Uses `http-errors` metadata when available
 * - Defaults to HTTP 500 for unknown errors
 *
 * Handles:
 * - Zod validation & parsing errors
 * - Mongoose persistence & constraint errors
 * - Booking/reservation errors
 * - Custom request validation errors
 * - HTTP errors from `http-errors`
 * - Unknown/unhandled errors
 *
 * @example
 * ```ts
 * app.use(handleGlobalErrors);
 * ```
 */
const handleGlobalErrors: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error("ERROR HANDLER |", error);

    if (isGlobalZodError(error)) {
        handleGlobalZodErrors(error, res);
        return;
    }

    if (isGlobalMongooseError(error)) {
        handleGlobalMongooseErrors(error, res);
        return;
    }

    if (isBookingError(error)) {
        handleBookingError(error, res);
        return;
    }

    if (isRequestError(error)) {
        handleRequestErrors(error, res);
        return;
    }

    let message = "Oops. Something went wrong!";
    let status = 500;

    if (isHttpError(error)) {
        message = error.message;
        status = error.status;
    }

    res.status(status).json({message});
};

export default handleGlobalErrors;
