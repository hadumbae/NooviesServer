import {Schema, Types, Model, model} from "mongoose";

export interface ISeatMap {
    seat: Types.ObjectId,
    isAvailable: boolean,
    price: number,
}

export interface IShowing {
    movie: Types.ObjectId,
    theatre: Types.ObjectId,
    screen: Types.ObjectId,
    startTime: Date,
    endTime: Date,
    seatMap: ISeatMap[],
    ticketPrice: number,
    language: string,
    subtitleLanguages: string[],
    isSpecialEvent: boolean,
}

const SeatMapSchema = new Schema({
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