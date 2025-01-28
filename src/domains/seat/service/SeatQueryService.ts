import type {Request} from "express";

import type {FilterQuery} from "mongoose";
import type ISeatFilters from "../schema/interface/ISeatFilters.js";
import {SeatFilterQuerySchema} from "../schema/query/SeatFilterQuerySchema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";

export interface ISeatQueryService {
    getMatchFilters({req}: {req: Request<any, any, any, ISeatFilters>}): FilterQuery<any>;
}

export default class SeatQueryService implements ISeatQueryService {
    getMatchFilters({req}: { req: Request<any, any, any, ISeatFilters> }): FilterQuery<ISeatFilters> {
        const {theatre, screen, row, seatNumber, seatType, isAvailable} = SeatFilterQuerySchema.parse(req.query);
        const conditions: FilterQuery<ISeatFilters> = {theatre, screen, row, seatNumber, seatType, isAvailable};
        return filterNullArray(conditions);
    }
}