import {Model, model, Schema} from "mongoose";
import type {ITheatre} from "./TheatreInterface.js";

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

