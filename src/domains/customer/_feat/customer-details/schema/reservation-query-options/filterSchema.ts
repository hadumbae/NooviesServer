/**
 * @fileoverview Zod schema and type definitions for filtering customer reservations.
 */

import {z} from "zod";
import filterNullishAttributes from "@/shared/utility/filterNullishAttributes";
import {ReservationBaseQueryFilterSchema} from "@/domains/reservations/_feat/validate-query-options";

/** Zod schema for filtering customer reservations. */
export const CustomerReservationQueryFiltersSchema = ReservationBaseQueryFilterSchema
    .omit({showing: true, user: true})
    .transform((values) => filterNullishAttributes(values));

/** Type definition for customer reservation query filters. */
export type CustomerReservationQueryFilters = z.infer<typeof CustomerReservationQueryFiltersSchema>;