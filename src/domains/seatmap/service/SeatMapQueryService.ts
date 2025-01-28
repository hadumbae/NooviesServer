import type {Request} from "express";
import {SeatMapFilterQuerySchema} from "../schema/SeatMapFilterQuerySchema.js";
import type {FilterQuery} from "mongoose";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {PopulateQueryFilters} from "../../../shared/types/mongoose/CustomMongooseAggregateTypes.js";

interface RequestFilters {
    isAvailable?: string;
    isReserved?: string;
    price?: string;
    seatRow?: string;
    seatNumber?: string;
    seatType?: string;
}

export interface ISeatMapQueryService {
    getSeatMapMatchFilters(params: {req: Request<any, any, any, RequestFilters>}): FilterQuery<any>;
    getSeatMapPopulateFilters(params: {req: Request<any, any, any, RequestFilters>}): PopulateQueryFilters;
}

export default class SeatMapQueryService implements ISeatMapQueryService{
    getSeatMapMatchFilters({req} : {req: Request<any, any, any, RequestFilters>}): FilterQuery<RequestFilters> {
        const {
            isAvailable,
            isReserved,
            price,
        } = SeatMapFilterQuerySchema.parse(req.query);

        const conditions: FilterQuery<RequestFilters> = {
            isAvailable,
            isReserved,
            price,
        };

        return filterNullArray(conditions) as FilterQuery<RequestFilters>;
    }

    getSeatMapPopulateFilters({req}: {req: Request<any, any, any, RequestFilters>}): PopulateQueryFilters {
        const {
            seatRow,
            seatNumber,
            seatType,
        } = SeatMapFilterQuerySchema.parse(req.query);

        const conditions: FilterQuery<RequestFilters> = filterNullArray({
            "seatMapSeat.row": seatRow,
            "seatMapSeat.seatNumber": seatNumber,
            "seatMapSeat.seatType": seatType,
        });

        if (Object.keys(conditions).length === 0) return [];

        return [
            {$lookup: {from: "seatmaps", localField: "seat", foreignField: "_id", as: "seatMapSeat"}},
            {$match: conditions},
        ];
    }
}