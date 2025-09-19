import createHttpError from "http-errors";
import {Types} from "mongoose";

import SeatMap from "../model/SeatMap.js";
import Showing from "../../showing/model/Showing.js";

import type {ZSeatMap} from "../schema/SeatMapSchema.js";

import type {PaginationReturns} from "../../../shared/types/PaginationReturns.js";

import type ISeatMapService from "./ISeatMapService.js";
import type {GetShowingSeatMapParams} from "./ISeatMapService.js";
import type ISeatMap from "../model/ISeatMap.js";
import Seat from "../../seat/model/Seat.model.js";


export default class SeatMapService implements ISeatMapService {
    async getShowingSeatMap(params: GetShowingSeatMapParams): Promise<PaginationReturns<ZSeatMap>> {
        const {showingID, page = 1, perPage = 100, matchFilters = {}, populateFilters = []} = params;

        const matchPipeline = {$match: {showing: new Types.ObjectId(showingID), ...matchFilters}};
        const [{totalItems = 0} = {}] = await SeatMap.aggregate([matchPipeline, {$count: "totalItems"}]);

        const items = await SeatMap.aggregate([
            matchPipeline,
            ...populateFilters,
            {$lookup: {from: "seats", localField: "seat", foreignField: "_id", as: "seat"}},
            {$lookup: {from: "showings", localField: "showing", foreignField: "_id", as: "showing"}},
            {$unwind: {path: "$seat", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$showing", preserveNullAndEmptyArrays: true}},
            {$skip: (page - 1) * perPage},
            {$limit: perPage},
        ]);

        return {totalItems, items};
    }

    async createShowingSeatMap({showingID}: { showingID: string }): Promise<void> {
        const showing = await Showing.findById(showingID).populate("movie");
        if (!showing) throw createHttpError(404, "Showing Not Found.");

        const {theatre, screen, ticketPrice} = showing;
        const seats = await Seat.find({theatre, screen, isAvailable: true});

        if (seats.length === 0) return;

        const seatMap = [];
        for (const {_id, priceMultiplier} of seats) {
            const document = {
                isAvailable: true,
                isReserved: false,
                price: priceMultiplier * ticketPrice,
                seat: _id,
                showing: showingID,
            };

            seatMap.push({insertOne: {document}});
        }

        const {insertedIds} = await SeatMap.bulkWrite(seatMap);

        await Showing.findByIdAndUpdate(showingID, {seating: Object.values(insertedIds)});
    }

    async toggleSeatMapAvailability({seatMapID}: {seatMapID: string}): Promise<ISeatMap> {
        const seatMap = await SeatMap.findById(seatMapID);
        if (!seatMap) throw createHttpError(404, "Seat Map not found.");

        if (seatMap.isAvailable == true) {
            // TODO - Delete Reservations
            // TODO - Set Active Status to Showing
        }

        const updatedSeatMap = await SeatMap
            .findByIdAndUpdate(seatMapID, {isAvailable: !seatMap.isAvailable}, {new: true})
            .populate(['seat', 'showing']);

        return updatedSeatMap!;
    }
}