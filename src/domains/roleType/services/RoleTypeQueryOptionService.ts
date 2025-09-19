import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type IRoleType from "../model/RoleType.interface.js";
import type {RoleTypeQueryFilters, RoleTypeQueryOptions} from "../schemas/filters/RoleTypeFilters.types.js";
import type {Request} from "express";
import {RoleTypeQueryOptionsSchema} from "../schemas/filters/RoleTypeFilters.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {FilterQuery, SortOrder} from "mongoose";

/**
 * Service for handling query options related to {@link IRoleType}.
 *
 * Implements {@link IQueryOptionService} specifically for the RoleType model.
 * This service is responsible for:
 * - Parsing and validating URL query parameters into a strongly typed object
 * - Converting query options into Mongoose-compatible `$match` filters
 * - Converting query options into Mongoose-compatible sort specifications
 *
 * @example
 * ```ts
 * const service = new RoleTypeQueryOptionService();
 *
 * // Extract and validate query parameters
 * const options = service.fetchQueryParams(req);
 * // => { roleName: "Engineer", sortByDepartment: 1 }
 *
 * // Generate filters for Mongoose queries
 * const filters = service.generateMatchFilters(options);
 * // => { roleName: { $regex: "Engineer", $options: "i" }, department: "IT" }
 *
 * // Generate sort options for Mongoose queries
 * const sorts = service.generateQuerySorts(options);
 * // => { roleName: 1, department: -1 }
 * ```
 */
export default class RoleTypeQueryOptionService
    implements IQueryOptionService<IRoleType, RoleTypeQueryOptions, RoleTypeQueryFilters> {
    /**
     * Extracts and validates query parameters from an Express request.
     *
     * Uses {@link RoleTypeQueryOptionsSchema} for validation and removes
     * null or undefined values.
     *
     * @param req - The incoming Express request
     * @returns A validated {@link RoleTypeQueryOptions} object
     *
     * @example
     * // ?roleName=Engineer&department=IT
     * // Returns: { roleName: "Engineer", department: "IT" }
     */
    fetchQueryParams(req: Request): RoleTypeQueryOptions {
        const params = RoleTypeQueryOptionsSchema.parse(req.query);
        return filterNullArray(params);
    }

    /**
     * Generates a Mongoose filter query from validated query options.
     *
     * - `roleName` is converted into a case-insensitive regex match.
     * - `department` is included as-is if provided.
     *
     * @param options - Validated query options
     * @returns A {@link FilterQuery} object for use in `Model.find()`
     *
     * @example
     * // { roleName: "Engineer", department: "IT" }
     * // => { roleName: { $regex: "Engineer", $options: "i" }, department: "IT" }
     */
    generateMatchFilters(options: RoleTypeQueryOptions): FilterQuery<RoleTypeQueryFilters> {
        const {roleName, department} = options;

        const filters = {
            roleName: roleName && {$regex: roleName, $options: "i"},
            department,
        };

        return filterNullArray(filters);
    }

    /**
     * Generates a Mongoose sort specification from validated query options.
     *
     * - `sortByRoleName` sorts results by the `roleName` field.
     * - `sortByDepartment` sorts results by the `department` field.
     *
     * @param options - Validated query options
     * @returns A partial mapping of {@link IRoleType} fields to {@link SortOrder}
     *
     * @example
     * // { sortByRoleName: 1, sortByDepartment: -1 }
     * // => { roleName: 1, department: -1 }
     */
    generateQuerySorts(options: RoleTypeQueryOptions): Partial<Record<keyof IRoleType, SortOrder>> {
        const {sortByRoleName, sortByDepartment} = options;

        const sorts = {
            roleName: sortByRoleName,
            department: sortByDepartment,
        };

        return filterNullArray(sorts);
    }
}
