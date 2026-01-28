import {z} from "zod";
import {
    ReservationQueryMatchFilterSchema,
    ReservationQueryMatchSortSchema,
    ReservationQueryOptionSchema,
} from "./ReservationQueryOption.schema.js";

/**
 * Match filter options for reservation queries.
 */
export type ReservationQueryMatchFilters =
    z.infer<typeof ReservationQueryMatchFilterSchema>;

/**
 * Sort options for reservation queries.
 */
export type ReservationQueryMatchSorts =
    z.infer<typeof ReservationQueryMatchSortSchema>;

/**
 * Complete set of query options for reservation queries.
 */
export type ReservationQueryOptions =
    z.infer<typeof ReservationQueryOptionSchema>;
