import {Model, model, Schema} from "mongoose";
import type {ISeatMap, IShowing} from "./ShowingInterfaces.js";

const SeatMapSchema = new Schema<ISeatMap>({
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