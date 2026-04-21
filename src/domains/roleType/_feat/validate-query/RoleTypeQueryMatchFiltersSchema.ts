/**
 * @fileoverview Validation schema for filtering RoleType entities in database queries.
 * Handles the mapping of URL parameters to specific organizational role attributes.
 */

import {z} from "zod";
import {RoleTypeDepartmentEnumSchema} from "@domains/roleType/schemas/RoleTypeDepartment.enum";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining the available match filters for RoleType queries.
 */
export const RoleTypeQueryMatchFiltersSchema = z.object({
    roleName: URLParamRegexPatternSchema,
    department: RoleTypeDepartmentEnumSchema.optional(),
});

/**
 * TypeScript type inferred from RoleTypeQueryMatchFiltersSchema.
 */
export type RoleTypeQueryMatchFilters = z.infer<typeof RoleTypeQueryMatchFiltersSchema>;