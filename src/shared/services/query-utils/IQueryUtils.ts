import type { Request } from "express";
import type { QueryOptionParams } from "../../schema/query/QueryOptionParamsSchema.js";
import type { QueryPaginationParams } from "../../schema/query/QueryPaginationParamsSchema.js";

/**
 * Interface defining utility methods for extracting query parameters from an Express request.
 */
export interface IQueryUtils {
    /**
     * Extracts pagination parameters (e.g., `page`, `perPage`) from the request query.
     *
     * @param req - The Express request object.
     * @returns An object containing pagination parameters.
     */
    fetchPaginationFromQuery(req: Request): QueryPaginationParams;

    /**
     * Extracts additional query options (e.g., filtering, sorting) from the request query.
     *
     * @param req - The Express request object.
     * @returns An object containing query option parameters.
     */
    fetchOptionsFromQuery(req: Request): QueryOptionParams;
}
