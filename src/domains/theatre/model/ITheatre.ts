import {Types} from "mongoose";
import type {IScreen} from "../../screen/interface/IScreen.js";
import type ISeat from "../../seat/model/ISeat.js";

export default interface ITheatre {
    _id: Types.ObjectId;
    name: string;
    location: string;
    seatCapacity: number;
}