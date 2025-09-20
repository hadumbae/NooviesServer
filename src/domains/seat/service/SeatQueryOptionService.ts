import type {Request} from "express";
import type {FilterQuery, SortOrder} from "mongoose";
import {SeatQueryFiltersSchema} from "../schema/query/SeatQueryOptions.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {SeatQueryFilters, SeatQueryOptions, SeatQuerySorts} from "../schema/query/SeatQueryOptions.types.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type ISeat from "../model/Seat.interface.js";

/**
 * Service class for handling query options related to seats.
 *
 * Implements {@link IQueryOptionService} for the `Seat` domain.
 * Provides methods to:
 * - Extract query options from HTTP requests
 * - Build MongoDB filter objects
 * - Generate MongoDB sort objects
 */
export default class SeatQueryOptionService
    implements IQueryOptionService<ISeat, SeatQueryOptions, SeatQueryFilters> {

    /**
     * Extracts and validates seat query parameters from an HTTP request.
     *
     * - Uses {@link SeatQueryFiltersSchema} to parse and validate input.
     * - Removes null or undefined values via {@link filterNullArray}.
     *
     * @param req - The incoming Express request containing query parameters
     * @returns A strongly typed {@link SeatQueryOptions} object
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryFiltersSchema.parse(req.query);
        return filterNullArray(conditions) as SeatQueryOptions;
    }

    /**
     * Generates MongoDB filter conditions for seat queries.
     *
     * - Supports regex search for string-based fields like `row` and `seatLabel`.
     * - Includes direct equality filters for other fields such as `seatNumber`, `seatType`, and `theatre`.
     *
     * @param params - Query options including filters
     * @returns A MongoDB {@link FilterQuery} object for seats
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryFilters> {
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
            row: row && {$regex: row, $options: "i"},
            seatLabel: seatLabel && {$regex: seatLabel, $options: "i"},
            seatNumber,
            seatType,
            isAvailable,
            theatre,
            screen,
        };

        return filters as FilterQuery<SeatQueryFilters>;
    }

    /**
     * Generates MongoDB sort conditions for seat queries.
     *
     * - Maps `sortBy*` parameters from {@link SeatQuerySorts} to actual seat fields.
     * - Removes null or undefined sort options using {@link filterNullArray}.
     *
     * @param params - Query options including sort preferences
     * @returns A MongoDB sort object mapping seat fields to sort orders (`1` or `-1`)
     */
    generateQuerySorts(params: SeatQueryOptions): Partial<Record<keyof ISeat, SortOrder>> {
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

        return filterNullArray(sorts);
    }
}
