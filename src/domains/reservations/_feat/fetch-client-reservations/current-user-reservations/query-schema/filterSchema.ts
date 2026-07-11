/**
 * @fileoverview Defines the validation schema and types for filtering the current user's reservations.
 */

import {ReservationBaseQueryFilterSchema} from "@/domains/reservations/_feat/validate-query-options";
import {z} from "zod";

/** Zod schema for filtering reservations associated with the current user. */
export const CurrentUserReservationQueryFilterSchema = ReservationBaseQueryFilterSchema.pick({
    uniqueCode: true,
    status: true,
    type: true,
});

/** Type inferred from the current user reservation query filter schema. */
export type CurrentUserReservationQueryFilters = z.infer<typeof CurrentUserReservationQueryFilterSchema>;