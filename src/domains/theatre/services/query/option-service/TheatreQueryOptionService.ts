import type {ITheatreQueryOptionService} from "./TheatreQueryOptionService.types.js";
import type {Request} from "express";
import type {
    TheatreMatchFilters,
    TheatreQueryOptions,
    TheatreSorts
} from "../../../schema/query/TheatreQueryOptions.types.js";
import {TheatreQueryOptionsSchema} from "../../../schema/query/TheatreQueryOptions.schema.js";
import filterNullArray from "../../../../../shared/utility/filterNullArray.js";
import type {FilterQuery} from "mongoose";

/**
 * Service for parsing, validating, and converting theatre query parameters
 * from HTTP requests into MongoDB-compatible filter and sort objects.
 *
 * This service:
 * - Validates incoming query parameters against Zod schemas.
 * - Generates MongoDB `FilterQuery` objects for filtering theatres.
 * - Generates MongoDB sort objects for sorting theatres.
 *
 * It is typically used in route handlers to translate Express `req.query`
 * into Mongoose-ready queries.
 */
export default class TheatreQueryOptionService implements ITheatreQueryOptionService {
    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request containing `req.query` parameters.
     * @returns A validated {@link TheatreQueryOptions} object with null/empty values removed.
     *
     * @example
     * ```ts
     * const options = service.fetchQueryParams(req);
     * // options: { city: "Bangkok", seatCapacity: 200 }
     * ```
     */
    fetchQueryParams(req: Request): TheatreQueryOptions {
        const parsed = TheatreQueryOptionsSchema.parse(req.query);
        return filterNullArray(parsed) as TheatreQueryOptions;
    }

    /**
     * Generates MongoDB filter conditions based on validated query parameters.
     *
     * String fields are converted to case-insensitive `$regex` matches.
     * Numeric fields are matched directly.
     *
     * @param params - Validated {@link TheatreQueryOptions} object.
     * @returns A MongoDB {@link FilterQuery} for matching theatres.
     *
     * @example
     * ```ts
     * const filters = service.generateMatchFilters(options);
     * // filters: { "location.city": { $regex: "Bangkok", $options: "i" } }
     * ```
     */
    generateMatchFilters(params: TheatreQueryOptions): FilterQuery<TheatreMatchFilters> {
        const {name, seatCapacity, city, country, postalCode, timezone} = params;
        
        const filters = {
            name: name && {$regex: name, $options: "i"},
            seatCapacity: seatCapacity,
            "location.city": city && {$regex: city, $options: "i"},
            "location.country": country,
            "location.postalCode": postalCode && {$regex: postalCode, $options: "i"},
            "location.timezone": timezone,
        };

        return filterNullArray(filters) as FilterQuery<TheatreMatchFilters>;
    }

    /**
     * Generates MongoDB sort object based on validated query parameters.
     *
     * Sort directions are typically `1` (ascending) or `-1` (descending),
     * as defined in {@link MongooseSortOrderSchema}.
     *
     * @param params - Validated {@link TheatreQueryOptions} object.
     * @returns A {@link TheatreSorts} object for sorting theatres.
     *
     * @example
     * ```ts
     * const sorts = service.generateQuerySorts(options);
     * // sorts: { "location.city": 1, seatCapacity: -1 }
     * ```
     */
    generateQuerySorts(params: TheatreQueryOptions): TheatreSorts {
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

        return filterNullArray(sorts) as TheatreSorts;
    }
}