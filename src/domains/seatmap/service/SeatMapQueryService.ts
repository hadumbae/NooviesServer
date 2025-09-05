import type {Request} from "express";
import {SeatMapFilterQuerySchema} from "../schema/SeatMapFilterQuerySchema.js";
import type {FilterQuery} from "mongoose";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {
    ReferenceFilterPipelineStages
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

interface RequestFilters {
    isAvailable?: string;
    isReserved?: string;
    price?: string;
    seatRow?: string;
    seatNumber?: string;
    seatType?: string;
}

export interface ISeatMapQueryService {
    getSeatMapMatchFilters(params: { req: Request<any, any, any, RequestFilters> }): FilterQuery<any>;

    getSeatMapPopulateFilters(params: { req: Request<any, any, any, RequestFilters> }): ReferenceFilterPipelineStages;
}

export default class SeatMapQueryService implements ISeatMapQueryService {
    getSeatMapMatchFilters({req}: { req: Request<any, any, any, RequestFilters> }): FilterQuery<RequestFilters> {
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

    getSeatMapPopulateFilters({req}: { req: Request<any, any, any, RequestFilters> }): ReferenceFilterPipelineStages {
        const {seatRow, seatNumber, seatType} = SeatMapFilterQuerySchema.parse(req.query);

        const filters: FilterQuery<RequestFilters> = filterNullArray({
            "row": seatRow,
            "seatNumber": seatNumber,
            "seatType": seatType,
        });

        if (Object.keys(filters).length === 0) return [];

        return [
            {
                $lookup: {
                    from: "seatmaps",
                    let: {seatID: "$seat"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$_id", "$$seatID"]}}},
                        {$match: filters}
                    ],
                    as: "seatMapSeat"
                }
            },
            {$unwind: "$seatMapSeat"},
            {$unset: "$seatMapSeat"}
        ];
    }
}