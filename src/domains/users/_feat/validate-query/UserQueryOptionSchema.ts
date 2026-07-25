/**
 * @fileoverview Defines the combined schema for user query filtering and sorting options.
 */

import {UserQueryFilterSchema} from "@/domains/users/_feat/validate-query/UserQueryFilterSchema";
import {UserQuerySortSchema} from "@/domains/users/_feat/validate-query/UserQuerySortSchema";
import {z} from "zod";

/** Zod schema that merges user filter and sort requirements. */
export const UserQueryOptionSchema = UserQueryFilterSchema.merge(UserQuerySortSchema);

/** Type definition for the combined user query options. */
export type UserQueryOptions = z.infer<typeof UserQueryOptionSchema>;