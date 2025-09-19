import type { Request } from "express";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type { IScreen } from "../interface/IScreen.js";
import {
    type ScreenQueryFilters,
    type ScreenQueryParams,
    type ScreenQueryOptions
} from "../schema/query/ScreenQueryOption.types.js";
import { ScreenQueryOptionsSchema } from "../schema/query/ScreenQueryOption.schema.js";
import type { SortOrder } from "mongoose";

/**
 * Interface defining methods for parsing and transforming screen query options.
 *
 * This service is responsible for:
 * - Extracting and validating query parameters from Express requests
 * - Generating MongoDB filter objects
 * - Generating MongoDB sort objects
 * - Extracting additional parameters such as `showingsPerScreen`
 */
export interface IScreenQueryService {
    /**
     * Extracts and validates query parameters from an Express request.
     *
     * @param req - Incoming HTTP request
     * @returns Validated {@link ScreenQueryOptions} object
     * @throws {ZodParseError} If the query parameters fail validation
     */
    fetchQueryParams(req: Request): ScreenQueryOptions;

    /**
     * Converts validated query options into MongoDB filter criteria.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns {@link ScreenQueryFilters} object usable in `.find()` queries
     */
    generateMatchFilters(params: ScreenQueryOptions): ScreenQueryFilters;

    /**
     * Extracts additional options from query parameters, e.g., `showingsPerScreen`.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns {@link ScreenQueryParams} object containing additional query options
     */
    generateOptions(params: ScreenQueryOptions): ScreenQueryParams;
}

/**
 * Service for parsing, validating, and transforming screen query parameters.
 *
 * Implements {@link IQueryOptionService} for the {@link IScreen} model.
 * Converts URL query parameters into MongoDB-compatible filter, sort, and
 * additional options objects.
 */
export default class ScreenQueryOptionService implements IQueryOptionService<IScreen, ScreenQueryOptions, ScreenQueryFilters> {
    /**
     * Extracts and validates query parameters from an Express request.
     *
     * @param req - Express request containing `req.query`
     * @returns Validated {@link ScreenQueryOptions} object
     * @throws {ZodParseError} If the query parameters are invalid
     */
    fetchQueryParams(req: Request): ScreenQueryOptions {
        const { success, data, error } = ScreenQueryOptionsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({ message: "Invalid Query Params.", errors: error.errors });
        return filterNullArray(data);
    }

    /**
     * Generates MongoDB filter object from validated query options.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns {@link ScreenQueryFilters} object for `.find()` queries
     */
    generateMatchFilters(params: ScreenQueryOptions): ScreenQueryFilters {
        const { theatre, capacity, screenType } = params;

        const filters = { theatre, capacity, screenType };
        return filterNullArray(filters);
    }

    /**
     * Generates MongoDB sort object from validated query options.
     *
     * @param options - Validated {@link ScreenQueryOptions}
     * @returns Partial mapping of {@link IScreen} fields to `SortOrder`
     */
    generateQuerySorts(options: ScreenQueryOptions): Partial<Record<keyof IScreen, SortOrder>> {
        const { sortByCapacity, sortByScreenType } = options;

        const sorts = { capacity: sortByCapacity, screenType: sortByScreenType };
        return filterNullArray(sorts);
    }

    /**
     * Extracts additional query parameters, such as the number of showings per screen.
     *
     * @param params - Validated {@link ScreenQueryOptions}
     * @returns {@link ScreenQueryParams} object containing additional options
     */
    generateParams(params: ScreenQueryOptions): ScreenQueryParams {
        const { showingsPerScreen } = params;

        const queryParams = {
            showingsPerScreen
        };

        return filterNullArray(queryParams);
    }
}
