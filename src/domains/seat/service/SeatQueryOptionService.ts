/**
 * @file SeatQueryOptionService.ts
 *
 * @summary Service for parsing, validating, and generating query options for Seat documents.
 *
 * @description
 * Implements {@link IQueryOptionService} to standardize query handling for {@link ISeat}:
 * - Extracts query parameters from Express requests
 * - Validates filters using {@link SeatQueryMatchFiltersSchema}
 * - Generates Mongoose `$match` filters
 * - Generates Mongoose `$sort` options
 * - Combines filters and sorts into a single query object
 */

import type { Request } from "express";
import type { FilterQuery, SortOrder } from "mongoose";
import { SeatQueryMatchFiltersSchema } from "../schema/query/SeatQueryOption.schema.js";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import type {
    SeatQueryMatchFilters,
    SeatQueryOptions,
} from "../schema/query/SeatQueryOption.types.js";
import type IQueryOptionService from "../../../shared/types/query-options/IQueryOptionService.js";
import type ISeat from "../model/Seat.interface.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * @class SeatQueryOptionService
 *
 * @implements IQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters>
 *
 * @summary Service class for managing Seat query options.
 *
 * @description
 * Provides standardized methods to:
 * - Parse query parameters from Express requests
 * - Generate Mongoose `$match` filters
 * - Generate Mongoose `$sort` options
 * - Combine filters and sorts into a single query option object
 */
export default class SeatQueryOptionService
    implements IQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request object
     * @returns Validated and filtered {@link SeatQueryOptions}
     *
     * @example
     * ```ts
     * const service = new SeatQueryOptionService();
     * const queryParams = service.fetchQueryParams(req);
     * ```
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryMatchFiltersSchema.parse(req.query);
        return filterNullishAttributes(conditions) as SeatQueryOptions;
    }

    /**
     * Generates Mongoose `$match` filters for Seat documents.
     *
     * @param params - Validated {@link SeatQueryOptions}
     * @returns Mongoose-compatible filter object ({@link FilterQuery<SeatQueryMatchFilters>})
     *
     * @example
     * ```ts
     * const matchFilters = service.generateMatchFilters(queryParams);
     * ```
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryMatchFilters> {
        const {
            _id,
            row,
            seatNumber,
            seatLabel,
            seatType,
            layoutType,
            isAvailable,
            theatre,
            screen,
        } = params;

        const filters = {
            _id,
            row: row && { $regex: row, $options: "i" },
            seatLabel: seatLabel && { $regex: seatLabel, $options: "i" },
            seatNumber,
            seatType,
            layoutType,
            isAvailable,
            theatre,
            screen,
        };

        return filterNullishAttributes(filters);
    }

    /**
     * Generates Mongoose `$sort` options for Seat documents.
     *
     * @param params - Validated {@link SeatQueryOptions}
     * @returns Partial record mapping Seat fields to {@link SortOrder}
     *
     * @example
     * ```ts
     * const sorts = service.generateMatchSorts(queryParams);
     * ```
     */
    generateMatchSorts(params: SeatQueryOptions): Partial<Record<keyof ISeat, SortOrder>> {
        const {
            sortByRow,
            sortBySeatNumber,
            sortBySeatLabel,
            sortBySeatType,
            sortByTheatre,
            sortByScreen,
            sortByIsAvailable,
            sortByPriceMultiplier,
        } = params;

        const sorts = {
            theatre: sortByTheatre,
            screen: sortByScreen,
            row: sortByRow,
            seatNumber: sortBySeatNumber,
            seatLabel: sortBySeatLabel,
            seatType: sortBySeatType,
            isAvailable: sortByIsAvailable,
            priceMultiplier: sortByPriceMultiplier,
        };

        return filterNullishAttributes(sorts);
    }

    /**
     * Combines `$match` filters and `$sort` options into a single query option object.
     *
     * @param options - Validated {@link SeatQueryOptions}
     * @returns {@link QueryOptionTypes} containing `match` filters and sorts
     *
     * @example
     * ```ts
     * const queryOptions = service.generateQueryOptions(queryParams);
     * // { match: { filters: {...}, sorts: {...} } }
     * ```
     */
    generateQueryOptions(options: SeatQueryOptions): QueryOptionTypes<ISeat, SeatQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
        };
    }
}
