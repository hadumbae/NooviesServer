import {z} from "zod";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {RoleTypeDepartmentEnumSchema} from "../RoleTypeDepartment.enum.js";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";

/**
 * Schema for filtering RoleType queries.
 *
 * @property roleName - A string (validated from a URL parameter) representing the name of the role.
 * @property department - Optional. An enum value representing the department associated with the role.
 */
export const RoleTypeQueryFiltersSchema = z.object({
    roleName: URLParamStringSchema,
    department: RoleTypeDepartmentEnumSchema.optional(),
});

/**
 * Schema for sorting RoleType queries.
 *
 * @property sortByRoleName - Optional. Defines the sort order (`1` for ascending, `-1` for descending) of role names.
 * @property sortByDepartment - Optional. Defines the sort order (`1` for ascending, `-1` for descending) of departments.
 */
export const RoleTypeQuerySortsSchema = z.object({
    sortByRoleName: MongooseSortOrderSchema.optional(),
    sortByDepartment: MongooseSortOrderSchema.optional(),
});

/**
 * Combined schema for RoleType query options.
 *
 * Includes both filters and sorts:
 * - Filters: `roleName`, `department`
 * - Sorts: `sortByRoleName`, `sortByDepartment`
 *
 * Useful for validating query parameters in endpoints that support
 * both filtering and sorting on RoleType resources.
 */
export const RoleTypeQueryOptionsSchema = RoleTypeQuerySortsSchema.merge(RoleTypeQueryFiltersSchema);