import type {Request} from "express";
import {PersonQueryMatchFiltersSchema} from "../schema/query/PersonQueryOption.schema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import {type FilterQuery, type SortOrder} from "mongoose";
import type {PersonQueryMatchFilters, PersonQueryOptions} from "../schema/query/PersonQueryOption.types.js";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import type {IPerson} from "../interfaces/IPerson.js";
import type IQueryOptionService from "../../../shared/types/query-options/IQueryOptionService.js";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Service responsible for parsing request query parameters and generating
 * Mongoose-compatible query filters and sorting options for Person documents.
 */
export default class PersonQueryOptionService
    implements IQueryOptionService<IPerson, PersonQueryOptions, PersonQueryMatchFilters> {

    /**
     * Parses query parameters from an Express request and validates them
     * against {@link PersonQueryMatchFiltersSchema}.
     *
     * @param req - Express request object containing query parameters.
     * @returns Parsed and validated filters for querying Person documents.
     * @throws ZodParseError if query parameters are invalid.
     */
    fetchQueryParams(req: Request): PersonQueryMatchFilters {
        const {success, data, error} = PersonQueryMatchFiltersSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Query Parameters.";
            throw new ZodParseError({message, errors: error.errors});
        }

        return data;
    }

    /**
     * Generates MongoDB match filters from the provided Person query options.
     * Supports case-insensitive regex matching for the name field.
     *
     * @param queries - Parsed Person query options.
     * @returns A Mongoose filter query object containing only active filters.
     */
    generateMatchFilters(queries: PersonQueryOptions): FilterQuery<PersonQueryMatchFilters> {
        const {_id, name, dob, nationality} = queries;

        const filters = {
            _id,
            nationality,
            dob,
            ...(name && {name: {$regex: name, $options: "i"}}),
        };

        return filterNullishAttributes(filters);
    }

    /**
     * Generates sorting instructions for MongoDB queries based on Person query options.
     *
     * @param queries - Parsed Person query options.
     * @returns A partial record mapping Person fields to Mongoose sort orders.
     */
    generateMatchSorts(queries: PersonQueryOptions): Partial<Record<keyof IPerson, SortOrder>> {
        const {sortByName, sortByNationality, sortByDOB} = queries;
        const sorts = {name: sortByName, dob: sortByDOB, nationality: sortByNationality};
        return filterNullishAttributes(sorts);
    }

    /**
     * Combines match filters and sorting into a complete set of query options
     * suitable for Mongoose queries.
     *
     * @param options - Parsed Person query options.
     * @returns An object containing `filters` and `sorts` for querying Person documents.
     */
    generateQueryOptions(options: PersonQueryOptions): QueryOptionTypes<IPerson, PersonQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: {filters: matchFilters, sorts: matchSorts},
        };
    }
}
