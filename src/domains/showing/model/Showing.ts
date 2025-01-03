import {Model, model, Schema} from "mongoose";
import type IShowing from "./IShowing.js";
import {SeatMapSchema} from "./SeatMap.js";

const ShowingSchema = new Schema<IShowing>({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },

    theatre: {
        type: Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },

    screen: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },

    startTime: {
        type: Date,
        required: [true, "Start Time is required."],
    },

    endTime: {
        type: Date,
        default: null,
        required: false,
    },

    seatMap: {
        type: [SeatMapSchema],
        required: true,
    },

    ticketPrice: {
        type: Number,
        gt: [0, "Ticket Price must be greater than 0."],
        required: true
    },

    language: {
        type: String,
        required: true
    },

    subtitleLanguages: {
        type: [String],
        required: true,
        validate: (langs: any) => Array.isArray(langs) && langs.length > 0,
    },

    isSpecialEvent: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {timestamps: true});

const Showing: Model<IShowing> = model<IShowing>("Showing", ShowingSchema);
export default Showing;