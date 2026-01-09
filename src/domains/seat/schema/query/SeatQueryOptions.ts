/**
 * @file SeatQueryOptions.ts
 *
 * Unified query option schema for Seat endpoints.
 *
 * Composes:
 * - Match-level filters (direct Seat fields)
 * - Reference-based filters (related documents)
 * - Match-level sort options
 */

import {z} from "zod";
import {
    SeatQueryMatchFiltersSchema,
    SeatQueryMatchSortsSchema
} from "./SeatMatchParams.js";
import {SeatQueryReferenceFilterSchema} from "./SeatReferenceParams.js";

/**
 * Combined query options for Seat queries.
 */
export const SeatQueryOptionsSchema =
    SeatQueryMatchFiltersSchema
        .merge(SeatQueryReferenceFilterSchema)
        .merge(SeatQueryMatchSortsSchema);

/**
 * Inferred type for seat query options.
 */
export type SeatQueryOptions =
    z.infer<typeof SeatQueryOptionsSchema>;
