/**
 * @fileoverview Zod schema and type definitions for filtering reservation queries.
 */

import {z} from "zod";
import {ObjectIdStringSchema} from "@/shared/schema/mongoose/ObjectIdStringSchema";
import {ReservationStatusSchema} from "src/domains/reservations/_validation/ReservationStatusSchema";
import {ReservationTypeSchema} from "src/domains/reservations/_validation/ReservationTypeSchema";

/** Zod schema for match-level reservation query filters. */
export const ReservationQueryMatchFilterSchema = z.object({
    userID: ObjectIdStringSchema,
    showingID: ObjectIdStringSchema,
    status: ReservationStatusSchema,
    type: ReservationTypeSchema,
});

/** Match filter options for reservation queries. */
export type ReservationQueryMatchFilters = z.infer<typeof ReservationQueryMatchFilterSchema>;