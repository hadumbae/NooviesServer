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
 * This class implements {@link IQueryOptionService} specifically for the RoleType model.
 * It is responsible for:
 * - Parsing and validating incoming URL query parameters
 * - Converting query options into Mongoose-compatible filters
 * - Converting query options into Mongoose-compatible sort specifications
 *
 * @example
 * ```ts
 * const service = new RoleTypeQueryOptionService();
 *
 * // Extract and validate query params
 * const options = service.fetchQueryParams(req);
 * // => { roleName: "Engineer", sortByDepartment: 1 }
 *
 * // Build filters
 * const filters = service.generateMatchFilters(options);
 * // => { roleName: { $regex: "Engineer", $options: "i" }, department: "IT" }
 *
 * // Build sorts
 * const sorts = service.generateQuerySorts(options);
 * // => { roleName: 1, department: -1 }
 * ```
 */
export default class RoleTypeQueryOptionService
    implements IQueryOptionService<IRoleType, RoleTypeQueryOptions, RoleTypeQueryFilters>
{
    /**
     * Parses and validates query parameters from an Express request
     * using {@link RoleTypeQueryOptionsSchema}, removing any `null` values.
     *
     * @param req - The incoming Express request.
     * @returns A validated {@link RoleTypeQueryOptions} object.
     */
    fetchQueryParams(req: Request): RoleTypeQueryOptions {
        const params = RoleTypeQueryOptionsSchema.parse(req.query);
        return filterNullArray(params);
    }

    /**
     * Generates a Mongoose filter query based on the validated query options.
     *
     * - `roleName` is converted into a case-insensitive regex match.
     * - `department` is included as-is if provided.
     *
     * @param options - Validated query options.
     * @returns A {@link FilterQuery} object usable in `Model.find()`.
     */
    generateMatchFilters(options: RoleTypeQueryOptions): FilterQuery<RoleTypeQueryFilters> {
        const { roleName, department } = options;

        const filters = {
            roleName: roleName && { $regex: roleName, $options: "i" },
            department,
        };

        return filterNullArray(filters);
    }

    /**
     * Generates a Mongoose sort specification based on the validated query options.
     *
     * - `sortByRoleName` sorts results by the `roleName` field.
     * - `sortByDepartment` sorts results by the `department` field.
     *
     * @param options - Validated query options.
     * @returns A partial mapping of {@link IRoleType} keys to {@link SortOrder}.
     */
    generateQuerySorts(options: RoleTypeQueryOptions): Partial<Record<keyof IRoleType, SortOrder>> {
        const { sortByRoleName, sortByDepartment } = options;
        const sorts = { roleName: sortByRoleName, department: sortByDepartment };
        return filterNullArray(sorts);
    }
}