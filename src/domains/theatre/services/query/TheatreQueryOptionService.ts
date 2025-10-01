import type { Request } from "express";
import type {
    TheatreQueryMatchFilters,
    TheatreQueryOptions,
} from "../../schema/query/TheatreQueryOption.types.js";
import { TheatreQueryOptionSchema } from "../../schema/query/TheatreQueryOption.schema.js";
import filterNullArray from "../../../../shared/utility/filterNullArray.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type IQueryOptionService from "../../../../shared/types/query-options/QueryOptionService.interface.js";
import type ITheatre from "../../model/ITheatre.js";
import type { QueryOptionTypes } from "../../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Service responsible for parsing request query parameters and generating
 * Mongoose-compatible filters and sorting instructions for Theatre documents.
 */
export default class TheatreQueryOptionService
    implements IQueryOptionService<ITheatre, TheatreQueryOptions, TheatreQueryMatchFilters> {

    /**
     * Parses query parameters from an Express request and validates them
     * against {@link TheatreQueryOptionSchema}.
     *
     * @param req - Express request containing query parameters
     * @returns Parsed and cleaned Theatre query options
     *
     * @example
     * // GET /theatres?name=Grand&sortByName=1
     * // Returns: { name: "Grand", sortByName: 1 }
     */
    fetchQueryParams(req: Request): TheatreQueryOptions {
        const parsed = TheatreQueryOptionSchema.parse(req.query);
        return filterNullArray(parsed) as TheatreQueryOptions;
    }

    /**
     * Generates MongoDB match filters based on Theatre query options.
     * Supports case-insensitive regex matching for string fields.
     *
     * @param params - Parsed Theatre query options
     * @returns Mongoose filter query object containing active filters
     */
    generateMatchFilters(params: TheatreQueryOptions): FilterQuery<TheatreQueryMatchFilters> {
        const {
            name,
            seatCapacity,
            city,
            country,
            postalCode,
            timezone,
        } = params;

        const filters = {
            name: name && { $regex: name, $options: "i" },
            seatCapacity: seatCapacity,
            "location.city": city && { $regex: city, $options: "i" },
            "location.country": country,
            "location.postalCode": postalCode && { $regex: postalCode, $options: "i" },
            "location.timezone": timezone,
        };

        return filterNullArray(filters);
    }

    /**
     * Generates sorting instructions for MongoDB queries based on Theatre query options.
     *
     * @param params - Parsed Theatre query options
     * @returns Partial record mapping Theatre fields to Mongoose sort orders
     */
    generateMatchSorts(params: TheatreQueryOptions): Partial<Record<keyof ITheatre, SortOrder>> {
        const {
            sortByName,
            sortBySeatCapacity,
            sortByCity,
            sortByCountry,
            sortByPostalCode,
            sortByTimezone,
        } = params;

        const sorts = {
            name: sortByName,
            seatCapacity: sortBySeatCapacity,
            "location.city": sortByCity,
            "location.country": sortByCountry,
            "location.postalCode": sortByPostalCode,
            "location.timezone": sortByTimezone,
        };

        return filterNullArray(sorts);
    }

    /**
     * Combines match filters and sorting into a complete set of query options
     * suitable for Mongoose queries.
     *
     * @param options - Parsed Theatre query options
     * @returns An object containing `filters` and `sorts` ready for querying Theatre documents
     *
     * @example
     * // GET /theatres?name=Grand&sortByName=1
     * // Returns:
     * // {
     * //   match: {
     * //     filters: { name: /Grand/i },
     * //     sorts: { name: 1 }
     * //   }
     * // }
     */
    generateQueryOptions(options: TheatreQueryOptions): QueryOptionTypes<ITheatre, TheatreQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
        };
    }
}
