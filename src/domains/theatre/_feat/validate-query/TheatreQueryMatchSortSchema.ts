/**
 * @fileoverview Validation schema for sorting Theatre entities in database queries.
 * Normalizes UI-driven sort parameters into Mongoose-compatible order values.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for Theatre queries.
 */
export const TheatreQueryMatchSortSchema = z.object({
    sortByName: URLParamSortOrderSchema,
    sortBySeatCapacity: URLParamSortOrderSchema,
    sortByCity: URLParamSortOrderSchema,
    sortByState: URLParamSortOrderSchema,
    sortByCountry: URLParamSortOrderSchema,
    sortByPostalCode: URLParamSortOrderSchema,
    sortByTimezone: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from TheatreQueryMatchSortSchema.
 */
export type TheatreQueryMatchSorts = z.infer<typeof TheatreQueryMatchSortSchema>;