import {Schema, Types, Model, model} from "mongoose";
import type {ISeat} from "../../seat/model/SeatModel.js";
import type {IScreen} from "../../screen/model/ScreenModel.js";

export interface ITheatre {
    _id: Types.ObjectId,
    name: string,
    location: string,
    numberOfSeats: number,
    screens: (Types.ObjectId | IScreen)[],
    seats: (Types.ObjectId | ISeat)[],
}

const TheatreSchema = new Schema<ITheatre>({
    name: {
        type: String,
        maxlength: [255, "Name must be 255 characters or less."],
        required: [true, "Name is required"],
    },

    location: {
        type: String,
        maxlength: [255, "Location must be 255 characters or less."],
        required: [true, "Location is required."]
    },

    numberOfSeats: {
        type: Number,
        required: [true, 'Number of Seats is required.'],
    },

    screens: {
        type: [{type: Schema.Types.ObjectId, ref: 'Seat'}],
        required: [true, "Screens is required."],
    },

    seats: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
        required: [true, "Seats is required."],
    },
}, {timestamps: true});

const Theatre: Model<ITheatre> = model<ITheatre>("Theatre", TheatreSchema);
export default Theatre;

