import {z} from "zod";
import {
    type RoleTypeQueryFiltersSchema,
    RoleTypeQueryOptionsSchema,
    RoleTypeQuerySortsSchema
} from "./RoleTypeFilters.schema.js";

/**
 * Type representing the validated query filters for RoleType.
 *
 * Derived from {@link RoleTypeQueryFiltersSchema}.
 *
 * @example
 * ```ts
 * const filters: RoleTypeQueryFilters = {
 *   roleName: "Engineer",
 *   department: "IT"
 * };
 * ```
 */
export type RoleTypeQueryFilters = z.infer<typeof RoleTypeQueryFiltersSchema>;

/**
 * Type representing the validated query sorts for RoleType.
 *
 * Derived from {@link RoleTypeQuerySortsSchema}.
 *
 * @example
 * ```ts
 * const sorts: RoleTypeQuerySorts = {
 *   sortByRoleName: 1, // ascending
 *   sortByDepartment: -1 // descending
 * };
 * ```
 */
export type RoleTypeQuerySorts = z.infer<typeof RoleTypeQuerySortsSchema>;

/**
 * Type representing the combined validated query options for RoleType,
 * including both filters and sorts.
 *
 * Derived from {@link RoleTypeQueryOptionsSchema}.
 *
 * @example
 * ```ts
 * const options: RoleTypeQueryOptions = {
 *   roleName: "Manager",
 *   sortByDepartment: 1
 * };
 * ```
 */
export type RoleTypeQueryOptions = z.infer<typeof RoleTypeQueryOptionsSchema>;