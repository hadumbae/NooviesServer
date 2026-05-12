/**
 * @fileoverview Validation schema for sorting MovieCredit entities in database queries.
 * Normalizes UI-driven sort parameters into Mongoose-compatible numeric literals.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for MovieCredit queries.
 */
export const MovieCreditQueryMatchSortsSchema = z.object({
    sortByCreditedAs: URLParamSortOrderSchema,
    sortByCharacterName: URLParamSortOrderSchema,
    sortByBillingOrder: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from MovieCreditQueryMatchSortsSchema.
 */
export type MovieCreditQueryMatchSorts = z.infer<typeof MovieCreditQueryMatchSortsSchema>;