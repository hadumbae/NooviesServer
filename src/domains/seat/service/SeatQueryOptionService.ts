import type {Request} from "express";

import type {FilterQuery} from "mongoose";
import {SeatMatchFilterSchema} from "../schema/query/SeatQueryOptions.schema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {SeatQueryMatchFilters, SeatQueryOptions, SeatQuerySorts} from "../schema/query/SeatQueryOptions.types.js";

export interface ISeatQueryOptionService {
    fetchQueryParams(req: Request): SeatQueryOptions;

    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryMatchFilters>;

    generateQuerySorts(params: SeatQueryOptions): SeatQuerySorts;
}

export default class SeatQueryOptionService implements ISeatQueryOptionService {
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatMatchFilterSchema.parse(req.query);
        return filterNullArray(conditions) as SeatQueryOptions;
    }

    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryMatchFilters> {
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
            row: row && {$regex: row, $options: "i"},
            seatLabel: seatLabel && {$regex: seatLabel, $options: "i"},
            seatNumber: seatNumber,
            seatType: seatType,
            isAvailable: isAvailable,
            theatre: theatre,
            screen: screen,
        };

        return filters as FilterQuery<SeatQueryMatchFilters>;
    }

    generateQuerySorts(params: SeatQueryOptions): SeatQuerySorts {
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

        return filterNullArray(sorts) as SeatQuerySorts;
    }
}