import type {Request} from "express";

interface ISeatQuery {
    theatre?: string;
    screen?: string;
    row?: string;
    seatNumber?: string;
    seatType?: string;
    isAvailable?: boolean;
}

export type SeatQueryRequest = Request<any, any, any, ISeatQuery>;

