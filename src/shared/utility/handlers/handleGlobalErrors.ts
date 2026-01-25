import type {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {isHttpError} from "http-errors";
import {handleGlobalZodErrors, isGlobalZodError} from "./errors/handleGlobalZodErrors.js";
import {handleGlobalMongooseErrors, isGlobalMongooseError} from "./errors/handleGlobalMongooseErrors.js";
import {handleRequestErrors, isRequestError} from "./errors/handleRequestErrors.js";

/**
 * @file handleGlobalErrors.ts
 *
 * Global Express error-handling middleware.
 *
 * Acts as the final error boundary for all API routes.
 * Detects known error types and delegates to specialized handlers,
 * falling back to a generic HTTP error response when necessary.
 *
 * Handles:
 * - Zod validation & parsing errors
 * - Mongoose persistence & constraint errors
 * - Custom request validation errors
 * - HTTP errors from `http-errors`
 * - Unknown/unhandled errors (500)
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
) => {
    console.error("ERROR HANDLER |", error);

    if (isGlobalZodError(error)) {
        handleGlobalZodErrors(error, res);
        return;
    }

    if (isGlobalMongooseError(error)) {
        handleGlobalMongooseErrors(error, res);
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
