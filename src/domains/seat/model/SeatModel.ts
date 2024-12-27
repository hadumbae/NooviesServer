import {Schema, Types, Model, model} from "mongoose";
import type {ITheatre} from "../../theatre/model/TheatreModel.js";
import {type SeatTypeEnumType} from "../schema/enum/SeatTypeEnum.js";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";

export interface ISeat {
    readonly _id: Types.ObjectId,
    theatre: Types.ObjectId | ITheatre,
    row: string,
    seatNumber: string,
    seatType: SeatTypeEnumType,
    isAvailable: boolean,
    priceMultiplier: number,
}


const SeatSchema = new Schema<ISeat>({
    theatre: {
        type: Schema.Types.ObjectId,
        ref: 'Theatre',
        required: [true, "Theatre is required."],
    },

    row: {
        type: String,
        maxLength: [50, "Row must be 50 characters or less."],
        required: [true, "Row is required."],
    },

    seatNumber: {
        type: String,
        maxLength: [50, "Seat Number be 50 characters or less."],
        required: [true, "Seat Number is required."],
    },

    seatType: {
        type: String,
        enum: SeatTypeConstant,
        default: 'Regular',
        required: [true, "Seat Type is required."],
    },

    isAvailable: {
        type: Boolean,
        default: true,
        required: [true, "Is Available is required."],
    },

    priceMultiplier: {
        type: Number,
        default: 1.0,
        required: [true, "Price Multiplier is required."],
    },
}, {timestamps: true});

const Seat: Model<ISeat> = model<ISeat>("Seat", SeatSchema);
export default Seat;