/**
 * @file SeatMapReferenceParam.schema.ts
 *
 * @summary
 * Zod schema and inferred type for seat map reference URL parameters.
 *
 * @description
 * Defines a query-ready schema for resolving seat map references
 * by movie, optional showing context, and seat identity.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {NonEmptyStringSchema} from "../../../../shared/schema/strings/NonEmptyStringSchema.js";
import {ShowingStatusEnumSchema} from "../../../showing/schema/ShowingStatusEnumSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import {SeatTypeEnum} from "../../../seat/schema/enum/SeatTypeEnum.js";

/**
 * Seat map reference parameter schema.
 *
 * @description
 * Filters seat map references by movie, showing metadata,
 * and concrete seat location.
 */
export const SeatMapReferenceFilterSchema = z.object({
    movie: URLParamObjectIDSchema,
    showingSlug: NonEmptyStringSchema.optional(),
    showingStatus: ShowingStatusEnumSchema.optional(),
    seatRow: URLParamStringSchema,
    seatNumber: URLParamPositiveNumberSchema,
    seatType: SeatTypeEnum.optional(),
});

/**
 * Inferred TypeScript type for seat map reference parameters.
 */
export type SeatMapReferenceFilters = z.infer<typeof SeatMapReferenceFilterSchema>;
