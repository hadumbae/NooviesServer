import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import ZodParseError from "../../errors/ZodParseError.js";
import { ZodError } from "zod";

/**
 * Global Express error-handling middleware.
 *
 * This middleware handles errors thrown in synchronous or asynchronous
 * route handlers and middleware, including:
 *
 * 1. **ZodError** – thrown by Zod schema validation. Responds with
 *    HTTP 422 and validation issues.
 * 2. **ZodParseError** – custom wrapper for structured Zod errors.
 *    Responds with HTTP 422 and validation details.
 * 3. **HTTP errors** (from `http-errors`) – uses the provided status
 *    code and message.
 * 4. **Other errors** – defaults to HTTP 500 with a generic message.
 *
 * All errors are logged to the console for debugging purposes.
 *
 * @param error - The error object thrown in route handlers or middleware.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function (not used here).
 *
 * @returns void
 *
 * @example
 * ```ts
 * import express from "express";
 * import errorHandler from "./middleware/errorHandler";
 *
 * const app = express();
 * app.use("/api", someRouter);
 * app.use(errorHandler); // must be last
 * ```
 */
const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("ERROR HANDLER | ", error);

    if (error instanceof ZodError) {
        console.error("Has a ZodError!");
        const { message, errors } = { message: "Validation failed.", errors: error.errors };
        res.status(422).json({ message, errors });
        return;
    }

    if (error instanceof ZodParseError) {
        console.error("Had a ZodParseError!");
        const { message, errors } = error;
        res.status(422).json({ message, errors });
        return;
    }

    let errorMessage = "Oops. Something went wrong!";
    let errorStatus = 500;

    if (isHttpError(error)) {
        errorMessage = error.message;
        errorStatus = error.status;
    }

    res.status(errorStatus).json({ message: errorMessage });
};

export default errorHandler;
