import type {Request} from "express";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type IQueryOptionService from "../../../shared/types/query-options/QueryOptionService.interface.js";
import type {IScreen} from "../interface/IScreen.js";
import {
    type ScreenQueryMatchFilters,
    type ScreenQueryParams,
    type ScreenQueryOptions
} from "../schema/query/ScreenQueryOption.types.js";
import {ScreenQueryOptionsSchema} from "../schema/query/ScreenQueryOption.schema.js";
import type {FilterQuery, SortOrder} from "mongoose";
import type {QueryOptionTypes} from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Service for parsing, validating, and generating query options for {@link IScreen} documents.
 *
 * Implements {@link IQueryOptionService} to provide a standardized way to:
 * - Extract query parameters from Express requests
 * - Generate Mongoose `$match` filters
 * - Generate Mongoose `$sort` specifications
 * - Extract additional query parameters (`options`) such as `showingsPerScreen`
 */
export default class ScreenQueryOptionService implements IQueryOptionService<IScreen, ScreenQueryOptions, ScreenQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request object
     * @returns Validated {@link ScreenQueryOptions} object
     * @throws {ZodParseError} If query parameters are invalid
     */
    fetchQueryParams(req: Request): ScreenQueryOptions {
        const {success, data, error} = ScreenQueryOptionsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Invalid Query Params.", errors: error.errors});
        return filterNullArray(data);
    }

    /**
     * Generates Mongoose `$match` filters from the provided screen query options.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns Mongoose-compatible filter object for screens
     *
     * @example
     * const filters = service.generateMatchFilters({ name: "IMAX", capacity: 100 });
     * // filters: { name: { $regex: "IMAX", $options: "i" }, capacity: 100 }
     */
    generateMatchFilters(params: ScreenQueryOptions): FilterQuery<ScreenQueryMatchFilters> {
        const {_id, name, theatre, capacity, screenType} = params;

        const filters = {
            _id,
            theatre,
            capacity,
            screenType,
            name: name && {$regex: name, $options: "i"},
        };

        return filterNullArray(filters);
    }

    /**
     * Generates Mongoose `$sort` specifications from the provided screen query options.
     *
     * @param options - Validated {@link ScreenQueryOptions}
     * @returns Partial record mapping screen fields to sort orders
     *
     * @example
     * const sorts = service.generateMatchSorts({ sortByCapacity: -1, sortByName: 1 });
     * // sorts: { capacity: -1, name: 1 }
     */
    generateMatchSorts(options: ScreenQueryOptions): Partial<Record<keyof IScreen, SortOrder>> {
        const {sortByName, sortByCapacity, sortByScreenType, sortByCreatedAt} = options;

        const sorts = {
            name: sortByName,
            capacity: sortByCapacity,
            screenType: sortByScreenType,
            createdAt: sortByCreatedAt
        };

        return filterNullArray(sorts);
    }

    /**
     * Extracts additional query parameters for screens.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns {@link ScreenQueryParams} containing extra query parameters
     *
     * @example
     * const params = service.generateParams({ showingsPerScreen: 5 });
     * // params: { showingsPerScreen: 5 }
     */
    generateParams(params: ScreenQueryOptions): ScreenQueryParams {
        const {showingsPerScreen} = params;

        const queryParams = {
            showingsPerScreen
        };

        return filterNullArray(queryParams);
    }

    /**
     * Generates a full query options object including filters, sorts, and additional parameters.
     *
     * @param options - Validated {@link ScreenQueryOptions}
     * @returns {@link QueryOptionTypes} combining match filters, sorts, and extra options
     *
     * @example
     * const queryOptions = service.generateQueryOptions({
     *   name: "IMAX",
     *   sortByCapacity: -1,
     *   showingsPerScreen: 5
     * });
     * // queryOptions: {
     * //   match: { filters: { name: /IMAX/i }, sorts: { capacity: -1 } },
     * //   options: { showingsPerScreen: 5 }
     * // }
     */
    generateQueryOptions(options: ScreenQueryOptions): QueryOptionTypes<IScreen, ScreenQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);
        const params = this.generateParams(options);

        return {
            match: {filters: matchFilters, sorts: matchSorts},
            options: params,
        };
    }
}
