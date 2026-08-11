/**
 * @fileoverview Factory function for creating authenticated CRUD query parsing middleware stacks.
 */

import {isAuth} from "@/domains/authentication/middleware/isAuth";
import type {ZodType, ZodTypeDef} from "zod";
import type {RequestHandler} from "express";
import {parseQueryFilters, parseQuerySorts} from "@/shared/_feat";

type MiddlewareConfig<
    TFilters extends Record<string, unknown>,
    TSorts extends Record<string, 1 | -1>
> = {
    modelName: string;
    filterSchema: ZodType<TFilters, ZodTypeDef, unknown>;
    sortSchema: ZodType<TSorts, ZodTypeDef, unknown>;
};

/**
 * Constructs an array of Express middleware handlers for authentication, query filter parsing, and query sort parsing.
 */
export function buildAuthCRUDQueryMiddleware<
    TFilters extends Record<string, unknown>,
    TSorts extends Record<string, 1 | -1>
>(
    {modelName, filterSchema, sortSchema}: MiddlewareConfig<TFilters, TSorts>
): RequestHandler[] {
    return [
        isAuth,
        parseQueryFilters({schema: filterSchema, modelName}),
        parseQuerySorts({schema: sortSchema, modelName}),
    ];
}