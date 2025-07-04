import {Model, model, Schema} from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import type ITheatre from "./ITheatre.js";

import {DeleteDocumentPost} from "./middleware/DeleteTheatre.document.middleware.js";
import {DeleteQueryPost} from "./middleware/DeleteTheatre.query.middleware.js";
import {FindQueryPre} from "./middleware/FindTheatre.query.middleware.js";

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
}, {timestamps: true});

/**
 * Virtuals
 */

TheatreSchema.virtual("screenCount", {
    ref: "Screen",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

TheatreSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

TheatreSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

TheatreSchema.plugin(mongooseLeanVirtuals);

/**
 * Middleware
 */

TheatreSchema.pre(["find", "findOne", "findOneAndUpdate"], {query: true, document: false}, FindQueryPre);
TheatreSchema.post("deleteOne", {query: false, document: true}, DeleteDocumentPost);
TheatreSchema.post(["deleteOne", "deleteMany"], {query: true, document: false}, DeleteQueryPost);

const Theatre: Model<ITheatre> = model<ITheatre>("Theatre", TheatreSchema);
export default Theatre;

