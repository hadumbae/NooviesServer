import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { isHttpError } from 'http-errors';

/**
 * Wraps an asynchronous Express route handler to automatically
 * catch errors and pass them to the `next` middleware.
 *
 * This utility eliminates repetitive `try/catch` blocks in async
 * route handlers. If the thrown error is not recognized as an
 * HTTP error, it sets the response status to 500 before forwarding it.
 *
 * @param fn - An asynchronous Express route handler function.
 *             It receives `(req, res, next)` and can return a Promise.
 * @returns An Express middleware function that wraps the async handler.
 *
 * @example
 * ```ts
 * import asyncHandler from "./middleware/asyncHandler";
 *
 * app.get("/users", asyncHandler(async (req, res) => {
 *   const users = await UserModel.find();
 *   res.json(users);
 * }));
 * ```
 */
export default function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => any): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await Promise.resolve(fn(req, res, next));
        } catch (error) {
            if (!isHttpError(error)) res.status(500);
            next(error);
        }
    };
}
