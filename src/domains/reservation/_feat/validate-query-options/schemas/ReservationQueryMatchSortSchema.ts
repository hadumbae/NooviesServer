/**
 * @fileoverview Defines the Zod schema and type for reservation query sorting options.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/** Zod schema for reservation query sorting options. */
export const ReservationQueryMatchSortSchema = z.object({
    sortByDateReserved: URLParamSortOrderSchema,
});

/** Sort options for reservation queries. */
export type ReservationQueryMatchSorts =
    z.infer<typeof ReservationQueryMatchSortSchema>;