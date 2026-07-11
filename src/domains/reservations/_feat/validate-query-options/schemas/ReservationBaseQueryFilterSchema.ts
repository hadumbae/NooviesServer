/**
 * @fileoverview Zod schema for validating base reservation query filters.
 */

import {z} from "zod";
import {ObjectIdStringSchema} from "@/shared/schema/mongoose/ObjectIdStringSchema";
import {ReservationStatusSchema} from "@/domains/reservations/_validation/ReservationStatusSchema";
import {ReservationTypeSchema} from "@/domains/reservations/_validation/ReservationTypeSchema";
import {URLParamRegexPatternSchema} from "@/shared/_feat/parse-query-string";

/** Zod schema for validating the base query parameters of a reservation. */
export const ReservationBaseQueryFilterSchema = z.object({
    userID: ObjectIdStringSchema,
    showingID: ObjectIdStringSchema,
    uniqueCode: URLParamRegexPatternSchema,
    status: ReservationStatusSchema,
    type: ReservationTypeSchema,
});

/** Type definition for the base reservation query filters inferred from the Zod schema. */
export type ReservationBaseQueryFilters = z.infer<typeof ReservationBaseQueryFilterSchema>;