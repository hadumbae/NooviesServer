import {type ZodTypeAny} from "zod";
import type {Request, Response, NextFunction, RequestHandler} from "express";
import ZodParseErrorHandler from "./ZodParseErrorHandler.js";

/**
 * Creates an Express middleware to validate `req.body` against a Zod schema.
 *
 * - Parses and validates the request body using the provided `schema`.
 * - If validation succeeds, attaches the parsed object to `req.validatedBody`.
 * - If validation fails, calls {@link ZodParseErrorHandler} to throw a structured error.
 *
 * @param schema - The Zod schema to validate `req.body` against.
 * @returns An Express {@link RequestHandler} middleware function.
 *
 * @example
 * ```ts
 * import express from "express";
 * import {RoleTypeInputSchema} from "./RoleTypeInputSchema.js";
 * import validateBody from "./ValidateBodyMiddleware.js";
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post("/roles", validateBody(RoleTypeInputSchema), (req, res) => {
 *   // `req.validatedBody` is strongly typed according to `RoleTypeInputSchema`
 *   const role = req.validatedBody;
 *   res.json(role);
 * });
 * ```
 *
 * @remarks
 * The parsed object is attached to `req.validatedBody`. You may need to
 * extend the Express `Request` type in your project to include this property:
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
export default (schema: ZodTypeAny): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedBody = schema.parse(req.body);
            next();
        } catch (e: any) {
            console.debug("Request Body: ", req.body);
            ZodParseErrorHandler(e);
        }
    };
