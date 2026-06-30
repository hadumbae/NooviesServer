/**
 * @fileoverview Defines the combined Zod schema and type for reservation query options.
 */

import {z} from "zod";
import {
    ReservationQueryMatchFilterSchema
} from "@/domains/reservations/_feat/validate-query-options/schemas/ReservationQueryMatchFilterSchema";
import {
    ReservationQueryMatchSortSchema
} from "@/domains/reservations/_feat/validate-query-options/schemas/ReservationQueryMatchSortSchema";

/** Zod schema merging reservation filter and sort criteria. */
export const ReservationQueryOptionSchema =
    ReservationQueryMatchFilterSchema.merge(ReservationQueryMatchSortSchema);

/** Combined filter and sort options for reservation queries. */
export type ReservationQueryOptions =
    z.infer<typeof ReservationQueryOptionSchema>;