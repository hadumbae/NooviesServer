/**
 * @fileoverview Zod schema for validating and normalizing customer reservation query sort parameters.
 */

import {z} from "zod";
import {normaliseQuerySort} from "@/shared/_feat";
import {ReservationBaseQuerySortSchema} from "@/domains/reservations/_feat/validate-query-options";

/** Zod schema for customer reservation query sorting options. */
export const CustomerReservationQuerySortsSchema = ReservationBaseQuerySortSchema
    .pick({sortByMovie: true, sortByStatus: true, sortByDateReserved: true})
    .transform(normaliseQuerySort);

/** Type definition for customer reservation query sorting options. */
export type CustomerReservationQuerySorts = z.infer<typeof CustomerReservationQuerySortsSchema>;