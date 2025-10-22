import { z } from "zod";
import { URLParamNumberSchema } from "../url/URLParamNumberSchema.js";

/**
 * Schema for validating query parameters used for pagination.
 *
 * @remarks
 * - Validates two numeric query parameters: `page` and `perPage`.
 * - Uses {@link URLParamNumberSchema} to ensure both are valid numbers.
 * - Defaults to environment variable values, or `1` for `page` and `25` for `perPage` if not set.
 * - Useful for API endpoints that return paginated lists.
 *
 * @example
 * ```ts
 * // With default values
 * QueryPaginationParamsSchema.parse({});
 * // ✅ returns { page: 1, perPage: 25 } if env defaults are not set
 *
 * // With custom query values
 * QueryPaginationParamsSchema.parse({ page: 2, perPage: 50 });
 * // ✅ returns { page: 2, perPage: 50 }
 *
 * // Invalid input
 * QueryPaginationParamsSchema.parse({ page: -1, perPage: 0 });
 * // ❌ throws ZodError from URLParamNumberSchema validation
 * ```
 */
export const QueryPaginationParamsSchema = z.object({
    page: URLParamNumberSchema.default(Number(process.env.PAGINATION_PAGE_DEFAULT ?? 1)),
    perPage: URLParamNumberSchema.default(Number(process.env.PAGINATION_PER_PAGE_DEFAULT ?? 25)),
});

/**
 * TypeScript type representing validated pagination query parameters.
 *
 * @remarks
 * - Inferred from {@link QueryPaginationParamsSchema}.
 * - Ensures `page` and `perPage` are numbers with valid defaults applied.
 */
export type QueryPaginationParams = z.infer<typeof QueryPaginationParamsSchema>;
