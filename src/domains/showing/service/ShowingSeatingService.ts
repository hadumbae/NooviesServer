import type {ZSeat} from "../../seat/schema/SeatSchema.js";
import Showing from "../model/Showing.js";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import Seat from "../../seat/model/Seat.js";

interface FetchSeatsForShowingParams {
    showingID: string;
    populate?: boolean;
    mapped?: boolean;
    lean?: boolean;
}

export interface IShowingSeatingService {
    fetchSeatsForShowing(params: FetchSeatsForShowingParams): Promise<ZSeat[]>;
}

export default class ShowingSeatingService implements IShowingSeatingService{
    async fetchSeatsForShowing(params: FetchSeatsForShowingParams): Promise<ZSeat[]> {
        const {
            showingID,
            populate = false,
            mapped = false,
            lean = false,
        } = params;

        const showing = await Showing.findById(showingID).populate("seating");
        if (!showing) throw createHttpError(404, "Showing not found!");

        const {theatre, screen, seating} = showing;

        const seatIDs = seating.reduce(
            (acc, {seat}) => [...acc, seat as Types.ObjectId],
            [] as Types.ObjectId[],
        );

        console.log(params);
        console.log(seatIDs);
        console.log(seating);

        const query = mapped
            ? Seat.find({_id: {$in: seatIDs}})
            : Seat.find({_id: {$nin: seatIDs}, theatre, screen});

        if (populate) query.populate("seat");
        if (lean) query.lean();

        return query;
    }
}