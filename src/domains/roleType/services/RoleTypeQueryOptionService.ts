import type IQueryOptionService from "../../../shared/types/query-options/QueryOptionService.interface.js";
import type IRoleType from "../model/RoleType.interface.js";
import type { RoleTypeQueryMatchFilters, RoleTypeQueryOptions } from "../schemas/filters/RoleTypeOption.types.js";
import type { Request } from "express";
import { RoleTypeQueryOptionsSchema } from "../schemas/filters/RoleTypeOption.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Service responsible for parsing request query parameters and generating
 * Mongoose-compatible query filters and sorting options for RoleType documents.
 */
export default class RoleTypeQueryOptionService
    implements IQueryOptionService<IRoleType, RoleTypeQueryOptions, RoleTypeQueryMatchFilters> {

    /**
     * Parses query parameters from an Express request and validates them
     * against {@link RoleTypeQueryOptionsSchema}.
     *
     * @param req - Express request containing query parameters
     * @returns Parsed and cleaned RoleType query options
     */
    fetchQueryParams(req: Request): RoleTypeQueryOptions {
        const params = RoleTypeQueryOptionsSchema.parse(req.query);
        return filterNullArray(params);
    }

    /**
     * Generates MongoDB match filters based on RoleType query options.
     * Supports case-insensitive regex matching for roleName.
     *
     * @param options - Parsed RoleType query options
     * @returns Mongoose filter query object containing active filters
     */
    generateMatchFilters(options: RoleTypeQueryOptions): FilterQuery<RoleTypeQueryMatchFilters> {
        const { roleName, department } = options;

        const filters = {
            roleName: roleName && { $regex: roleName, $options: "i" },
            department,
        };

        return filterNullArray(filters);
    }

    /**
     * Generates sorting instructions for MongoDB queries based on RoleType query options.
     *
     * @param options - Parsed RoleType query options
     * @returns Partial record mapping RoleType fields to Mongoose sort orders
     */
    generateMatchSorts(options: RoleTypeQueryOptions): Partial<Record<keyof IRoleType, SortOrder>> {
        const { sortByRoleName, sortByDepartment } = options;

        const sorts = {
            roleName: sortByRoleName,
            department: sortByDepartment,
        };

        return filterNullArray(sorts);
    }

    /**
     * Combines match filters and sorting into a complete set of query options
     * suitable for Mongoose queries.
     *
     * @param options - Parsed RoleType query options
     * @returns An object containing `filters` and `sorts` ready for querying RoleType documents
     */
    generateQueryOptions(options: RoleTypeQueryOptions): QueryOptionTypes<IRoleType, RoleTypeQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
        };
    }
}
