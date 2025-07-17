import {Model, model, Schema} from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import type ITheatre from "./ITheatre.js";

import {DeleteDocumentPost} from "./middleware/DeleteTheatre.document.middleware.js";
import {DeleteQueryPost} from "./middleware/DeleteTheatre.query.middleware.js";
import {FindQueryPre} from "./middleware/FindTheatre.query.middleware.js";
import {LocationSchema} from "../../../shared/model/location/Location.js";

/**
 * Schema
 */

const TheatreSchema = new Schema<ITheatre>({
    name: {
        type: String,
        trim: true,
        maxlength: [255, "Name must be 255 characters or less."],
        required: [true, "Name is required"],
    },

    seatCapacity: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: "Seat Capacity must be an integer"
        }
    },

    location: {
        type: LocationSchema,
        required: [true, "Location is required."],
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

