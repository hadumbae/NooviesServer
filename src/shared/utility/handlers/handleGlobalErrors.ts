import type {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {isHttpError} from "http-errors";
import {handleGlobalZodErrors, isGlobalZodError} from "./errors/handleGlobalZodErrors.js";
import {handleGlobalMongooseErrors, isGlobalMongooseError} from "./errors/handleGlobalMongooseErrors.js";

/**
 * Global Express error-handling middleware.
 *
 * Centralizes error handling for all API routes.
 *
 * Handles:
 * - **Zod validation errors** (422)
 * - **Custom Zod parsing & duplicate index errors** (422 / 409)
 * - **Mongoose persistence errors** (404 / 409)
 * - **HTTP errors** from `http-errors`
 * - **Unhandled errors** (500 fallback)
 *
 * @param error - Error thrown by route handlers or middleware.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
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
        return handleGlobalZodErrors(error, res);
    }

    if (isGlobalMongooseError(error)) {
        return handleGlobalMongooseErrors(error, res);
    }

    let errorMessage = "Oops. Something went wrong!";
    let errorStatus = 500;

    if (isHttpError(error)) {
        errorMessage = error.message;
        errorStatus = error.status;
    }

    res.status(errorStatus).json({message: errorMessage});
};

export default handleGlobalErrors;
