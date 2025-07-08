import type {ZSeat} from "../../../seat/schema/seats/Seat.types.js";
import {Types} from "mongoose";

export type FetchSeatsByRowParams = {
    screenID: Types.ObjectId;
    populate?: boolean;
};

export type SeatsByRow = {
    row: string;
    numberOfSeats: number;
    seats: ZSeat[];
};

export interface IScreenSeatService {
    fetchSeatsByRow(params: FetchSeatsByRowParams): Promise<SeatsByRow[]>;
}