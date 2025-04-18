import type {PaginationRequest, PopulateRequest} from "../../types/request/CustomRequestTypes.js";
import {PaginationSchema} from "../../schema/PaginationSchemas.js";
import ZodParseError from "../../errors/ZodParseError.js";
import {ParamBoolean} from "../../schema/helpers/ZodBooleanHelpers.js";

type PopulateQueryReturn = boolean | undefined;
type PaginationQueryReturns = { page: number, perPage: number };

/**
 * Interface defining utility methods for query parameter extraction and validation.
 */
export interface IQueryUtils {
    /**
     * Parses and validates the `populate` query parameter from the request.
     *
     * @param req - The HTTP request containing the `populate` query parameter.
     * @returns A boolean indicating the value of `populate`, or `undefined` if not provided.
     * @throws ZodParseError if the `populate` parameter is invalid.
     */
    fetchPopulateFromQuery(req: PopulateRequest): PopulateQueryReturn;

    /**
     * Parses and validates the `page` and `perPage` query parameters from the request.
     *
     * @param req - The HTTP request containing the `page` and `perPage` query parameters.
     * @returns An object containing the validated `page` and `perPage` values.
     * @throws ZodParseError if the pagination parameters are invalid.
     */
    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns;
}

/**
 * Utility functions for extracting and validating query parameters from HTTP requests.
 *
 * @remarks
 * This module provides methods to parse and validate query parameters such as `populate`, `page`, and `perPage`.
 * It ensures that the extracted parameters conform to the expected formats and types.
 *
 * @example
 * ```ts
 * import QueryUtils from './QueryUtils';
 *
 * const populate = QueryUtils.fetchPopulateFromQuery(req);
 * const pagination = QueryUtils.fetchPaginationFromQuery(req);
 * ```
 */
const QueryUtils: IQueryUtils = {
    fetchPopulateFromQuery(req: PopulateRequest): PopulateQueryReturn {
        const populate = req.query.populate;
        const result = ParamBoolean.safeParse(populate);

        if (!result.success) {
            throw new ZodParseError({message: "Invalidate `Populate` Query.", errors: result.error.errors});
        }

        return result.data;
    },

    fetchPaginationFromQuery(req: PaginationRequest): PaginationQueryReturns {
        const page = req.query.page || parseInt(process.env.PAGINATION_PAGE_DEFAULT!);
        const perPage = req.query.perPage || parseInt(process.env.PAGINATION_PER_PAGE_DEFAULT!);

        const result = PaginationSchema.safeParse({page, perPage});

        if (!result.success) {
            throw new ZodParseError({message: "Validation Failed.", errors: result.error.errors});
        }

        return result.data!;
    }
}

export default QueryUtils;
