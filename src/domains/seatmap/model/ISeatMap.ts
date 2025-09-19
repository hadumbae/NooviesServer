import {Types} from "mongoose";
import type ISeat from "../../seat/model/Seat.interface.js";
import type IShowing from "../../showing/model/IShowing.js";

export default interface ISeatMap {
    readonly _id?: Types.ObjectId | string;
    isAvailable?: boolean,
    isReserved?: boolean,
    price: number,
    showing: Types.ObjectId | string | IShowing,
    seat: Types.ObjectId | string | ISeat,
}