import { z } from "zod";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { RoleTypeDepartmentEnumSchema } from "../RoleTypeDepartment.enum.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filters that can be applied when querying RoleType documents.
 */
export const RoleTypeQueryMatchFiltersSchema = z.object({
    /** Filter by role name (string, optional). */
    roleName: URLParamStringSchema,

    /** Filter by department, using predefined department enum (optional). */
    department: RoleTypeDepartmentEnumSchema.optional(),
});

/**
 * Sorting options when querying RoleType documents.
 */
export const RoleTypeQueryMatchSortsSchema = z.object({
    /** Sort RoleType by role name in ascending or descending order. */
    sortByRoleName: URLParamMongooseSortOrderSchema,

    /** Sort RoleType by department in ascending or descending order. */
    sortByDepartment: URLParamMongooseSortOrderSchema,
});

/**
 * Combined schema for RoleType query options including filters and sorting.
 */
export const RoleTypeQueryOptionsSchema = RoleTypeQueryMatchSortsSchema.merge(RoleTypeQueryMatchFiltersSchema);
