import {Types} from "mongoose";
import type {SeatTypeEnumType} from "../schema/enum/SeatTypeEnum.js";
import type {ITheatre} from "../../theatre/model/TheatreInterface.js";

export interface ISeatBase {
    row: string,
    seatNumber: string,
    seatType: SeatTypeEnumType,
    isAvailable: boolean,
    priceMultiplier: number,
}

export interface ISeatSubmit extends ISeatBase {
    theatre: string;
}

export interface ISeat extends ISeatBase{
    readonly _id: Types.ObjectId,
    theatre: Types.ObjectId | ITheatre,
}