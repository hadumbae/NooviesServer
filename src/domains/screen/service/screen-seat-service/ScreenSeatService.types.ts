import {Types} from "mongoose";
import type ISeat from "../../../seat/model/ISeat.js";

export type FetchSeatsByRowParams = {
    screenID: Types.ObjectId;
    populate?: boolean;
};

export type SeatsByRow = {
    row: string;
    numberOfSeats: number;
    seats: ISeat[];
};

export interface IScreenSeatService {
    fetchSeatsByRow(params: FetchSeatsByRowParams): Promise<SeatsByRow[]>;
}