import {z} from "zod";
import {
    ShowingQueryMatchFilterSchema,
    ShowingQueryMatchSortSchema,
    ShowingQueryOptionSchema,
    ShowingQueryReferenceFilterSchema,
} from "./ShowingQueryOption.schema.js";

/**
 * @file ShowingQueryOption.types.ts
 *
 * TypeScript type exports inferred from Showing query Zod schemas.
 *
 * These types represent the validated and normalized shape of URL
 * query parameters after schema parsing.
 */

/**
 * Match-level filter options applied directly to Showing fields.
 */
export type ShowingQueryMatchFilters =
    z.infer<typeof ShowingQueryMatchFilterSchema>;

/**
 * Sort options for Showing queries.
 */
export type ShowingQueryMatchSorts =
    z.infer<typeof ShowingQueryMatchSortSchema>;

/**
 * Reference-based text filters applied to related documents.
 */
export type ShowingQueryReferenceFilters =
    z.infer<typeof ShowingQueryReferenceFilterSchema>;

/**
 * Complete set of query options supported by Showing endpoints.
 *
 * Combines match filters, sort options, and reference filters.
 */
export type ShowingQueryOptions =
    z.infer<typeof ShowingQueryOptionSchema>;
