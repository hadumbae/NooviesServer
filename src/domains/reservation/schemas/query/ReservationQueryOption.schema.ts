import { z } from "zod";
import { ObjectIdStringSchema } from "../../../../shared/schema/mongoose/ObjectIdStringSchema.js";
import { ReservationStatusEnumSchema } from "../enum/ReservationStatusEnumSchema.js";
import { ReservationTypeEnumSchema } from "../enum/ReservationTypeEnumSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * @file ReservationQueryOption.schema.ts
 *
 * Zod schemas for filtering and sorting reservation queries.
 *
 * These schemas are intended for validating URL query parameters
 * used when fetching reservations from the API.
 */

/**
 * Match-level filters for querying reservations.
 *
 * All fields are optional at runtime (via partial application in controllers),
 * but are defined here strictly for composability and inference.
 */
export const ReservationQueryMatchFilterSchema = z.object({
    /** Filter reservations by owning user ID */
    userID: ObjectIdStringSchema,

    /** Filter reservations by showing ID */
    showingID: ObjectIdStringSchema,

    /** Filter reservations by reservation status */
    status: ReservationStatusEnumSchema,

    /** Filter reservations by reservation type */
    type: ReservationTypeEnumSchema,
});

/**
 * Sorting options for reservation queries.
 */
export const ReservationQueryMatchSortSchema = z.object({
    /** Sort by reservation creation date */
    sortByDateReserved: URLParamMongooseSortOrderSchema,
});

/**
 * Combined filter + sort options for reservation queries.
 */
export const ReservationQueryOptionSchema =
    ReservationQueryMatchFilterSchema.merge(ReservationQueryMatchSortSchema);
