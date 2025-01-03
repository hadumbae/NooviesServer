import {Schema} from "mongoose";
import type ISeatMap from "./ISeatMap.js";

export const SeatMapSchema = new Schema<ISeatMap>({
    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: [true, "Is Available is required."],
    },
    price: {
        type: Number,
        gt: [0, "Price must be greater than 0."],
        required: [true, "Price is required."],
    },
});