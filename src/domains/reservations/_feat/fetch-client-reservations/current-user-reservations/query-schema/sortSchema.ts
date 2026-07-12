/**
 * @fileoverview Zod schema for sorting reservations belonging to the currently authenticated user.
 */

import {ReservationBaseQuerySortSchema} from "@/domains/reservations/_feat/validate-query-options";
import {z} from "zod";
import {normaliseQuerySort} from "@/shared/_feat";

/** Zod schema that picks specific sort fields from the base reservation query schema. */
export const CurrentUserReservationQuerySortSchema = ReservationBaseQuerySortSchema
    .pick({sortByStatus: true, sortByDateReserved: true})
    .transform(normaliseQuerySort);

/** Type inferred from the current user reservation query sort schema. */
export type CurrentUserReservationQuerySorts = z.infer<typeof CurrentUserReservationQuerySortSchema>;