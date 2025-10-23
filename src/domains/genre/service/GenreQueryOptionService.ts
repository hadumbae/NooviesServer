import type { Request } from "express";
import type { GenreQueryMatchFilters, GenreQueryOptions } from "../schema/query/GenreQueryOption.types.js";
import type { FilterQuery, SortOrder } from "mongoose";
import { GenreQueryOptionsSchema } from "../schema/query/GenreQueryOption.schema.js";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import type IGenre from "../model/Genre.interface.js";
import type IQueryOptionService from "../../../shared/types/query-options/QueryOptionService.interface.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Service responsible for parsing and generating query options
 * for Genre entities, including filters and sorting.
 */
export default class GenreQueryOptionService implements IQueryOptionService<any, any, any> {

    /**
     * Extracts and validates query parameters from an Express request object.
     * Filters out null or undefined values.
     *
     * @param req - Express request object containing query parameters.
     * @returns Parsed and cleaned genre query options.
     */
    fetchQueryParams(req: Request): GenreQueryOptions {
        const conditions = GenreQueryOptionsSchema.parse(req.query);
        return filterNullishAttributes(conditions) as GenreQueryOptions;
    }

    /**
     * Generates MongoDB match filters based on the provided genre query options.
     * Supports partial matching for the genre name (case-insensitive).
     *
     * @param params - The parsed genre query options.
     * @returns A Mongoose filter query object with only the active filters.
     */
    generateMatchFilters(params: GenreQueryOptions): FilterQuery<GenreQueryMatchFilters> {
        const { name } = params;

        const filters = {
            name: name && { $regex: name, $options: "i" },
        };

        return filterNullishAttributes(filters);
    }

    /**
     * Generates sorting instructions for MongoDB queries based on genre query options.
     *
     * @param params - The parsed genre query options.
     * @returns A partial record of genre fields mapped to Mongoose sort orders.
     */
    generateMatchSorts(params: GenreQueryOptions): Partial<Record<keyof IGenre, SortOrder>> {
        const { sortByName } = params;

        const sorts: Partial<Record<keyof IGenre, SortOrder | undefined>> = {
            name: sortByName,
        };

        return filterNullishAttributes(sorts);
    }

    /**
     * Combines match filters and sorting into a complete query options object
     * suitable for Mongoose queries.
     *
     * @param options - The parsed genre query options.
     * @returns An object containing `filters` and `sorts` ready for querying genres.
     */
    generateQueryOptions(options: GenreQueryOptions): QueryOptionTypes<IGenre, GenreQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
        };
    }
}
