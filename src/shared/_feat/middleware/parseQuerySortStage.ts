/**
 * @fileoverview Express middleware factory for validating and attaching query options to the request object.
 */

import {type ZodType, type ZodTypeDef} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import InvalidRequestQueryError from "@shared/errors/InvalidRequestQueryError";
import type {PipelineStage} from "mongoose";

/** Props configuration for the parse query match stage middleware. */
type ParseParams = {
    schema: ZodType<PipelineStage.Sort, ZodTypeDef, unknown>;
    modelName?: string;
};

/** Validates request query parameters against a Zod schema and attaches the parsed match stage to the request object. */
export function parseQuerySortStage({schema, modelName}: ParseParams): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const {data, success, error} = schema.safeParse(req.query);

        if (!success) {
            throw new InvalidRequestQueryError({
                modelName,
                errors: error?.errors,
                message: "Invalid query sorting options."
            });
        }

        req.querySortStage = data;

        next();
    };
}