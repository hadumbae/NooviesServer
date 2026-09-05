/**
 * @fileoverview Utility functions for parsing and validating Express request query parameters using Zod schemas.
 */

import type {Request} from "express";
import {RequestValidationError} from "../../errors/RequestValidationError.js";
import {type QueryOptionParams, QueryOptionParamsSchema} from "../../schema/query/QueryOptionParamsSchema.js";
import type {IQueryUtils} from "./IQueryUtils.js";
import {
    type QueryPaginationParams,
    QueryPaginationParamsSchema
} from "../../schema/query/QueryPaginationParamsSchema.js";

/** Object containing methods for extracting validated pagination and option parameters from requests. */
export const QueryUtils: IQueryUtils = {
    fetchPaginationFromQuery(req: Request): QueryPaginationParams {
        const {success, data, error} =
            QueryPaginationParamsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Pagination Query.";
            throw new RequestValidationError({message, errors: error.errors});
        }

        return data;
    },

    fetchOptionsFromQuery(req: Request): QueryOptionParams {
        const {success, data, error} =
            QueryOptionParamsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Query Options.";
            throw new RequestValidationError({message, errors: error?.errors});
        }

        return data;
    },
};