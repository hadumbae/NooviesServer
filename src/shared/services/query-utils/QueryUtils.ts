import type {Request} from "express";
import {RequestValidationError} from "../../errors/RequestValidationError.js";
import {type QueryOptionParams, QueryOptionParamsSchema} from "../../schema/query/QueryOptionParamsSchema.js";
import type {IQueryUtils} from "./IQueryUtils.js";
import {
    type QueryPaginationParams,
    QueryPaginationParamsSchema
} from "../../schema/query/QueryPaginationParamsSchema.js";

/**
 * Utility functions for extracting and validating query parameters
 * from an Express request object.
 *
 * All validation is performed using Zod schemas. If validation fails,
 * a {@link RequestValidationError} is thrown with details about the error.
 */
const QueryUtils: IQueryUtils = {
    /**
     * Extracts and validates pagination parameters from the query string.
     *
     * @param req - The Express request containing the query parameters.
     * @returns A strongly typed {@link QueryPaginationParams} object if validation succeeds.
     * @throws {RequestValidationError} If the query parameters do not match {@link QueryPaginationParamsSchema}.
     *
     * @example
     * ```ts
     * const pagination = QueryUtils.fetchPaginationFromQuery(req);
     * console.log(pagination.page, pagination.limit);
     * ```
     */
    fetchPaginationFromQuery(req: Request): QueryPaginationParams {
        const {success, data, error} =
            QueryPaginationParamsSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Pagination Query.";
            throw new RequestValidationError({message, errors: error.errors});
        }

        return data;
    },

    /**
     * Extracts and validates general query option parameters
     * (e.g., filters, sorting) from the query string.
     *
     * @param req - The Express request containing the query parameters.
     * @returns A strongly typed {@link QueryOptionParams} object if validation succeeds.
     * @throws {RequestValidationError} If the query parameters do not match {@link QueryOptionParamsSchema}.
     *
     * @example
     * ```ts
     * const options = QueryUtils.fetchOptionsFromQuery(req);
     * console.log(options.sort, options.filter);
     * ```
     */
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

export default QueryUtils;