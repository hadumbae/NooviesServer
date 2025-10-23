import type {Request, Response, NextFunction} from "express";
import type {ZodTypeAny} from "zod";
import asyncHandler from "../../handlers/asyncHandler.js";
import handleZodError from "../handlers/handleZodError.js";

/**
 * Creates an Express middleware to asynchronously validate `req.body` against a Zod schema.
 *
 * - Uses `schema.parseAsync` to handle asynchronous refinements or transformations.
 * - On success, attaches the parsed and validated body to `req.validatedBody`.
 * - On failure, passes the error to {@link handleZodError}, which throws a structured error.
 *
 * @param schema - The Zod schema to validate `req.body` against.
 * @returns An Express middleware wrapped in {@link asyncHandler} to properly handle async errors.
 *
 * @example
 * ```ts
 * import express from "express";
 * import {RoleTypeInputSchema} from "./RoleTypeInputSchema.js";
 * import validateBodyAsync from "./ValidateBodyAsyncMiddleware.js";
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post("/roles", validateBodyAsync(RoleTypeInputSchema), (req, res) => {
 *   // `req.validatedBody` is strongly typed according to `RoleTypeInputSchema`
 *   const role = req.validatedBody;
 *   res.json(role);
 * });
 * ```
 *
 * @remarks
 * Because this middleware is async, it must be wrapped in an async handler (`asyncHandler`)
 * to properly propagate errors to Express's error handling pipeline.
 *
 * You may need to extend the Express `Request` type in your TypeScript project:
 *
 * ```ts
 * declare global {
 *   namespace Express {
 *     interface Request {
 *       validatedBody?: z.infer<typeof RoleTypeInputSchema>;
 *     }
 *   }
 * }
 * ```
 */
export default (schema: ZodTypeAny) =>
    asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.validatedBody = await schema.parseAsync(req.body);
                next();
            } catch (e: unknown) {
                console.debug("Failed Request Body: ", req.body);
                handleZodError(e);
            }
        }
    );
