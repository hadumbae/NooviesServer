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
 * Service responsible for parsing, validating, and generating query options
 * for {@link ISeat} documents.
 *
 * Implements {@link IQueryOptionService} to provide standardized methods for:
 * - Extracting query parameters from Express requests
 * - Generating Mongoose `$match` filters
 * - Generating Mongoose `$sort` options
 * - Combining filters and sorts into query option objects
 */
export default class SeatQueryOptionService
    implements IQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters> {

    /**
     * Parses query parameters from an Express request and validates them
     * against {@link SeatQueryMatchFiltersSchema}.
     *
     * @param req - Express request object
     * @returns Validated and filtered {@link SeatQueryOptions}
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryMatchFiltersSchema.parse(req.query);
        return filterNullishAttributes(conditions) as SeatQueryOptions;
    }

    /**
     * Generates Mongoose `$match` filters for querying seats.
     *
     * @param params - Validated {@link SeatQueryOptions}
     * @returns Mongoose-compatible filter object of type {@link FilterQuery<SeatQueryMatchFilters>}
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryMatchFilters> {
        const {
            _id,
            row,
            seatNumber,
            seatLabel,
            seatType,
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
            isAvailable,
            theatre,
            screen,
        };

        return filterNullishAttributes(filters);
    }

    /**
     * Generates Mongoose `$sort` options for querying seats.
     *
     * @param params - Validated {@link SeatQueryOptions}
     * @returns Partial record mapping seat fields to {@link SortOrder}
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
     * Combines match filters and sort options into a single query option object.
     *
     * @param options - Validated {@link SeatQueryOptions}
     * @returns {@link QueryOptionTypes} containing `match` filters and sorts
     */
    generateQueryOptions(options: SeatQueryOptions): QueryOptionTypes<ISeat, SeatQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
        };
    }
}
