/**
 * @fileoverview Utility for safely extracting MongoDB filter criteria from validated query objects.
 * Prevents runtime errors when accessing deeply nested aggregation objects and provides
 * a standard fallback for empty queries.
 */

import {z, type ZodTypeAny} from "zod";

/**
 * Safely extracts the `$match` filter criteria from a transformed Zod query output.
 */
export function getQueryOptionFilters<TSchema extends ZodTypeAny>(
    queries: z.output<TSchema> | undefined
): Record<string, unknown> {
    return queries?.match?.filters?.$match ?? {};
}