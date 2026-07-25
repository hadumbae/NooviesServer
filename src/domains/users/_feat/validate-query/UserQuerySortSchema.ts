/**
 * @fileoverview Zod schema for validating user-related query string sorting parameters.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";

/** Zod schema defining the allowed sort fields and orders for user queries. */
export const UserQuerySortSchema = z.object({
    sortByName: URLParamSortOrderSchema,
    sortByEmail: URLParamSortOrderSchema,
    sortByUniqueCode: URLParamSortOrderSchema,
});

/** Type definition for user query sorting parameters inferred from UserQuerySortSchema. */
export type UserQuerySorts = z.infer<typeof UserQuerySortSchema>;