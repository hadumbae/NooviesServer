/**
 * @fileoverview Validation schema for sorting RoleType entities in database queries.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for RoleType queries.
 */
export const RoleTypeQueryMatchSortsSchema = z.object({
    sortByRoleName: URLParamSortOrderSchema,
    sortByDepartment: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from RoleTypeQueryMatchSortsSchema.
 */
export type RoleTypeQueryMatchSorts = z.infer<typeof RoleTypeQueryMatchSortsSchema>;