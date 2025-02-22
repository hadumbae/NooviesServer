import type {Request} from "express";

import type {FilterQuery} from "mongoose";
import {type SeatQuery, SeatQuerySchema} from "../schema/query/SeatQuerySchema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {SeatQueryRequest} from "../type/SeatQueryRequest.js";

export interface ISeatQueryService {
    getMatchFilters({req}: {req: SeatQueryRequest}): FilterQuery<SeatQuery>;
}

export default class SeatQueryService implements ISeatQueryService {
    getMatchFilters({req}: { req: SeatQueryRequest }): FilterQuery<SeatQuery> {
        const conditions: FilterQuery<SeatQuery> = SeatQuerySchema.parse(req.query);
        return filterNullArray(conditions);
    }
}