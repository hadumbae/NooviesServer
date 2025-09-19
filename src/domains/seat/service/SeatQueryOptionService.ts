import type { Request } from "express";
import type { FilterQuery, SortOrder } from "mongoose";
import { SeatQueryFiltersSchema } from "../schema/query/SeatQueryOptions.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type { SeatQueryFilters, SeatQueryOptions, SeatQuerySorts } from "../schema/query/SeatQueryOptions.types.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type ISeat from "../model/ISeat.js";

/**
 * Interface defining the methods for a Seat query option service.
 *
 * Provides methods for:
 * - Extracting and validating URL query parameters
 * - Generating Mongoose filters (`$match`) from query options
 * - Generating Mongoose sort specifications
 */
export interface ISeatQueryOptionService {
    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request containing `req.query`
     * @returns A validated {@link SeatQueryOptions} object with null/undefined values removed.
     */
    fetchQueryParams(req: Request): SeatQueryOptions;

    /**
     * Generates MongoDB filter conditions based on validated query options.
     *
     * @param params - Validated {@link SeatQueryOptions} object
     * @returns A {@link FilterQuery} object for Mongoose `.find()` queries
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryFilters>;

    /**
     * Generates Mongoose sort specifications from validated query options.
     *
     * @param params - Validated {@link SeatQueryOptions} object
     * @returns {@link SeatQuerySorts} mapping seat fields to `SortOrder` (`1` for ascending, `-1` for descending)
     */
    generateQuerySorts(params: SeatQueryOptions): SeatQuerySorts;
}

/**
 * Service for parsing, validating, and converting seat query parameters
 * from HTTP requests into MongoDB-compatible filter and sort objects.
 *
 * This service implements {@link IQueryOptionService} specifically for the {@link ISeat} model.
 * It is typically used in seat-related controllers to convert `req.query` into Mongoose-ready queries.
 */
export default class SeatQueryOptionService implements IQueryOptionService<ISeat, SeatQueryOptions, SeatQueryFilters> {
    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request containing `req.query`
     * @returns A {@link SeatQueryOptions} object with empty/null values removed
     *
     * @example
     * ```ts
     * const options = service.fetchQueryParams(req);
     * // => { row: "A", seatType: "VIP", isAvailable: true }
     * ```
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryFiltersSchema.parse(req.query);
        return filterNullArray(conditions) as SeatQueryOptions;
    }

    /**
     * Generates MongoDB `$match` filters from validated query options.
     *
     * String fields are converted to case-insensitive regex matches.
     *
     * @param params - Validated {@link SeatQueryOptions} object
     * @returns A {@link FilterQuery} for matching seats in MongoDB
     *
     * @example
     * ```ts
     * const filters = service.generateMatchFilters(options);
     * // => { row: { $regex: "A", $options: "i" }, seatType: "VIP" }
     * ```
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryFilters> {
        const {
            row,
            seatNumber,
            seatLabel,
            seatType,
            isAvailable,
            theatre,
            screen,
        } = params;

        const filters = {
            row: row && { $regex: row, $options: "i" },
            seatLabel: seatLabel && { $regex: seatLabel, $options: "i" },
            seatNumber,
            seatType,
            isAvailable,
            theatre,
            screen,
        };

        return filters as FilterQuery<SeatQueryFilters>;
    }

    /**
     * Generates MongoDB sort object from validated query options.
     *
     * @param params - Validated {@link SeatQueryOptions} object
     * @returns Partial mapping of {@link ISeat} fields to {@link SortOrder}
     *
     * @example
     * ```ts
     * const sorts = service.generateQuerySorts(options);
     * // => { row: 1, seatNumber: -1 }
     * ```
     */
    generateQuerySorts(params: SeatQueryOptions): Partial<Record<keyof ISeat, SortOrder>> {
        const {
            sortByRow,
            sortBySeatNumber,
            sortBySeatLabel,
            sortBySeatType,
        } = params;

        const sorts = {
            row: sortByRow,
            seatNumber: sortBySeatNumber,
            seatLabel: sortBySeatLabel,
            seatType: sortBySeatType,
        };

        return filterNullArray(sorts);
    }
}
