/**
 * @fileoverview Zod schema for validating base reservation query filters.
 */

import {z} from "zod";
import {ReservationStatusSchema} from "@/domains/reservations/_validation/ReservationStatusSchema";
import {ReservationTypeSchema} from "@/domains/reservations/_validation/ReservationTypeSchema";
import {URLParamRegexPatternSchema} from "@/shared/_feat/parse-query-string";
import {URLParamObjectIDSchema} from "@/shared/schema/url/URLParamObjectIDSchema";

/** Zod schema for validating the base query parameters of a reservation. */
export const ReservationBaseQueryFilterSchema = z.object({
    userID: URLParamObjectIDSchema,
    showingID: URLParamObjectIDSchema,
    uniqueCode: URLParamRegexPatternSchema,
    status: ReservationStatusSchema.optional(),
    type: ReservationTypeSchema.optional(),
});

/** Type definition for the base reservation query filters inferred from the Zod schema. */
export type ReservationBaseQueryFilters = z.infer<typeof ReservationBaseQueryFilterSchema>;