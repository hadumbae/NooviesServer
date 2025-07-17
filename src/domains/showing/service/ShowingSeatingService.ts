import Showing from "../model/Showing.js";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import Seat from "../../seat/model/Seat.js";
import type ISeat from "../../seat/model/ISeat.js";

interface FetchSeatsForShowingParams {
    showingID: string;
    populate?: boolean;
    mapped?: boolean;
    lean?: boolean;
}

export interface IShowingSeatingService {
    fetchSeatsForShowing(params: FetchSeatsForShowingParams): Promise<ISeat[]>;
}

export default class ShowingSeatingService implements IShowingSeatingService {
    async fetchSeatsForShowing(params: FetchSeatsForShowingParams): Promise<ISeat[]> {
        const {showingID, populate = false, mapped = false, lean = false} = params;

        const showing = await Showing.findById(showingID).populate("seating");
        if (!showing) throw createHttpError(404, "Showing not found!");

        const {theatre, screen, seating} = showing;

        const seatIDs = seating.reduce(
            (acc, {seat}) => [...acc, seat as Types.ObjectId],
            [] as Types.ObjectId[],
        );

        const query = mapped
            ? Seat.find({_id: {$in: seatIDs}})
            : Seat.find({_id: {$nin: seatIDs}, theatre, screen});

        if (populate) query.populate("seat");
        if (lean) query.lean();

        return query;
    }
}