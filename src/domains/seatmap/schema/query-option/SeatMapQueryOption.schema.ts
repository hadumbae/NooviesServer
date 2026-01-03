/**
 * @file SeatMapQueryOption.schema.ts
 *
 * @summary
 * Zod schema and inferred type for seat map query options.
 *
 * @description
 * Combines reference filters, match filters, and sort options
 * into a single query-ready schema for seat map queries.
 */

import {SeatMapMatchFilterSchema, SeatMapMatchSortSchema} from "./SeatMapMatchParam.schema.js";
import {SeatMapReferenceFilterSchema} from "./SeatMapReferenceParam.schema.js";
import {z} from "zod";

/**
 * Seat map query option schema.
 *
 * @description
 * Merges reference, match, and sort schemas into a unified
 * query parameter definition.
 */
export const SeatMapQueryOptionSchema =
    SeatMapReferenceFilterSchema
        .merge(SeatMapMatchFilterSchema)
        .merge(SeatMapMatchSortSchema);

/**
 * Inferred TypeScript type for seat map query options.
 */
export type SeatMapQueryOptions = z.infer<typeof SeatMapQueryOptionSchema>;
