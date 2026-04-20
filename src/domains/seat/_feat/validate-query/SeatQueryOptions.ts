/**
 * @file SeatQueryOptions.ts
 *
 * Unified query option schema for Seat endpoints.
 *
 * Composes:
 * - Match-level filters (direct Seat fields)
 * - Match-level sort options
 */

import {z} from "zod";
import {
    SeatQueryMatchFiltersSchema
} from "./SeatQueryMatchFilterSchema";
import {SeatQueryMatchSortsSchema} from "@domains/seat/_feat/validate-query/SeatQueryMatchSortsSchema";

/**
 * Combined query options for Seat queries.
 */
export const SeatQueryOptionsSchema = SeatQueryMatchFiltersSchema.merge(SeatQueryMatchSortsSchema);

/**
 * Inferred type for seat query options.
 */
export type SeatQueryOptions =
    z.infer<typeof SeatQueryOptionsSchema>;
