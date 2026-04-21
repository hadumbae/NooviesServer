/**
 * @fileoverview Validation schema for direct attribute filtering of SeatMap entities.
 * These filters target the real-time state of a specific seat for a specific showing.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamPositiveNumberSchema} from "@shared/schema/url/URLParamPositiveNumberSchema";
import {SeatMapStatusEnumSchema} from "@domains/seatmap/schema/enum/SeatMapStatusEnumSchema";

/**
 * Zod schema defining match-level filters for SeatMap queries.
 */
export const SeatMapQueryMatchFilterSchema = z.object({
    showing: URLParamObjectIDSchema,
    seat: URLParamObjectIDSchema,
    price: URLParamPositiveNumberSchema,
    status: SeatMapStatusEnumSchema.optional(),
});

/**
 * TypeScript type inferred from SeatMapQueryMatchFilterSchema.
 */
export type SeatMapQueryMatchFilters = z.infer<typeof SeatMapQueryMatchFilterSchema>;