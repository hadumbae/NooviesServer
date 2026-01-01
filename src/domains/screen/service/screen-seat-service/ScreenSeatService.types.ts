import {Types} from "mongoose";
import type {SeatSchemaFields} from "../../../seat/model/Seat.types.js";

export type FetchSeatsByRowParams = {
    screenID: Types.ObjectId;
    populate?: boolean;
};

export type SeatsByRow = {
    row: string;
    numberOfSeats: number;
    seats: SeatSchemaFields[];
};

export interface IScreenSeatService {
    fetchSeatsByRow(params: FetchSeatsByRowParams): Promise<SeatsByRow[]>;
}