/**
 * @fileoverview Defines the Zod schema and type for reservation query sorting options.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";

/** Zod schema for reservation query sorting options. */
export const ReservationBaseQuerySortSchema = z.object({
    sortByStatus: URLParamSortOrderSchema,
    sortByDateReserved: URLParamSortOrderSchema,
    sortByDatePaid: URLParamSortOrderSchema,
    sortByDateCancelled: URLParamSortOrderSchema,
    sortByDateRefunded: URLParamSortOrderSchema,
    sortByDateExpired: URLParamSortOrderSchema,
});

/** Sort options for reservation queries. */
export type ReservationBaseQuerySorts = z.infer<typeof ReservationBaseQuerySortSchema>;