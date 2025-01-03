import {Types} from "mongoose";
import type ISeat from "../../seat/model/ISeat.js";

export default interface ISeatMap {
    readonly _id?: Types.ObjectId | string;
    isAvailable?: boolean,
    price: number,
    seat: Types.ObjectId | string | ISeat,
}