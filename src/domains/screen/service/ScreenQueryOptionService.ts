import type {Request} from "express";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type {IScreen} from "../interface/IScreen.js";
import {
    type ScreenQueryFilters,
    type ScreenQueryParams,
    type ScreenQueryOptions
} from "../schema/query/ScreenQueryOption.types.js";
import {ScreenQueryOptionsSchema} from "../schema/query/ScreenQueryOption.schema.js";
import type {FilterQuery, SortOrder} from "mongoose";

/**
 * Service for parsing, validating, and transforming screen query parameters.
 *
 * Implements {@link IQueryOptionService} for the {@link IScreen} model.
 * Converts URL query parameters into MongoDB-compatible filter, sort, and
 * additional option objects.
 */
export default class ScreenQueryOptionService implements IQueryOptionService<IScreen, ScreenQueryOptions, ScreenQueryFilters> {

    /**
     * Extracts and validates query parameters from an Express request.
     *
     * @param req - The incoming Express request object.
     * @returns A validated and cleaned {@link ScreenQueryOptions} object.
     * @throws {ZodParseError} If the query parameters fail schema validation.
     */
    fetchQueryParams(req: Request): ScreenQueryOptions {
        const {success, data, error} = ScreenQueryOptionsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Invalid Query Params.", errors: error.errors});
        return filterNullArray(data);
    }

    /**
     * Converts validated query options into a Mongoose filter object.
     *
     * @param params - The validated query options.
     * @returns A {@link FilterQuery} for {@link IScreen} that can be passed to `.find()`.
     *
     * Name filtering is done case-insensitively using a regular expression.
     */
    generateMatchFilters(params: ScreenQueryOptions): FilterQuery<ScreenQueryFilters> {
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
     * Converts validated query options into a Mongoose sort specification.
     *
     * @param options - The validated query options.
     * @returns A partial mapping of {@link IScreen} keys to {@link SortOrder}.
     */
    generateQuerySorts(options: ScreenQueryOptions): Partial<Record<keyof IScreen, SortOrder>> {
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
     * Extracts additional query parameters from validated options.
     *
     * @param params - The validated query options.
     * @returns {@link ScreenQueryParams}, such as `showingsPerScreen`.
     */
    generateParams(params: ScreenQueryOptions): ScreenQueryParams {
        const {showingsPerScreen} = params;

        const queryParams = {
            showingsPerScreen
        };

        return filterNullArray(queryParams);
    }
}
