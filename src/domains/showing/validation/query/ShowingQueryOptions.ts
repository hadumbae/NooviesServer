/**
 * @file ShowingQueryOptionSchema.ts
 *
 * Unified query option schema for Showing endpoints.
 *
 * Composes:
 * - Match-level filters (direct Showing fields)
 * - Match-level sort options
 * - Reference-based filters (related documents)
 */

import {z} from "zod";
import {ShowingQueryReferenceFilterSchema}
    from "./ShowingReferenceParams.js";
import {
    ShowingQueryMatchFilterSchema,
    ShowingQueryMatchSortSchema
} from "./ShowingMatchParams.js";

/**
 * Combined query options for Showing queries.
 */
export const ShowingQueryOptionSchema =
    ShowingQueryMatchFilterSchema
        .merge(ShowingQueryMatchSortSchema)
        .merge(ShowingQueryReferenceFilterSchema);

/**
 * Inferred type for showing query options.
 */
export type ShowingQueryOptions =
    z.infer<typeof ShowingQueryOptionSchema>;
