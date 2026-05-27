/**
 * @fileoverview Defines the Zod schema and type for reservation query sorting options.
 */

import {z} from "zod";
import {URLParamMongooseSortOrderSchema} from "@shared/schema/url/URLParamMongooseSortOrderSchema";

/** Zod schema for reservation query sorting options. */
export const ReservationQueryMatchSortSchema = z.object({
    sortByDateReserved: URLParamMongooseSortOrderSchema,
});

/** Sort options for reservation queries. */
export type ReservationQueryMatchSorts =
    z.infer<typeof ReservationQueryMatchSortSchema>;