/**
 * @fileoverview Zod schema for validating user moderation log query string sorting parameters.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";

/** Zod schema defining the allowed sort fields and orders for user moderation log queries. */
export const UserModerationLogQuerySortSchema = z.object({
    sortByAction: URLParamSortOrderSchema,
    sortByModDate: URLParamSortOrderSchema,
});

/** Type definition for user moderation log query sorting parameters. */
export type UserModerationLogQuerySorts = z.infer<typeof UserModerationLogQuerySortSchema>;