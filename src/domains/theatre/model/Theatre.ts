import {Model, model, Schema} from "mongoose";
import type ITheatre from "./ITheatre.js";

import {
    DeleteTheatreQueryPostMiddleware,
    DeleteOneTheatreDocumentPostMiddleware,
} from "./middleware/TheatreMiddleware.js";

/**
 * Schema
 */

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

    seatCapacity: {
        type: Number,
        default: 0,
        required: [true, 'Seat Capacity is required.'],
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

/**
 * Middleware
 */

TheatreSchema.post("deleteOne", {query: false, document: true}, DeleteOneTheatreDocumentPostMiddleware);
TheatreSchema.post(["deleteOne", "deleteMany"], {query: true, document: false}, DeleteTheatreQueryPostMiddleware);

const Theatre: Model<ITheatre> = model<ITheatre>("Theatre", TheatreSchema);
export default Theatre;

