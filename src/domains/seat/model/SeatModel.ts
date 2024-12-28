import {Model, model, Schema} from "mongoose";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";
import type {ISeat} from "./SeatModel.interfaces.js";


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