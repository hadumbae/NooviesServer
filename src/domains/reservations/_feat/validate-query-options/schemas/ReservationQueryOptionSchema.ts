/**
 * @fileoverview Defines the combined Zod schema and type for reservation query options.
 */

import {z} from "zod";
import {
    ReservationBaseQueryFilterSchema
} from "@/domains/reservations/_feat/validate-query-options/schemas/ReservationBaseQueryFilterSchema";
import {
    ReservationBaseQuerySortSchema
} from "@/domains/reservations/_feat/validate-query-options/schemas/ReservationBaseQuerySortSchema";

/** Zod schema merging reservation filter and sort criteria. */
export const ReservationQueryOptionSchema =
    ReservationBaseQueryFilterSchema.merge(ReservationBaseQuerySortSchema);

/** Combined filter and sort options for reservation queries. */
export type ReservationQueryOptions =
    z.infer<typeof ReservationQueryOptionSchema>;