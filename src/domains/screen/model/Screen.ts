import {Schema, Model, model} from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

import type {IScreen} from "../interface/IScreen.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";

import {DeleteOneDocumentPost} from "./middleware/DeleteScreen.document.middleware.js";
import {DeleteQueryPost} from "./middleware/DeleteScreen.query.middleware.js";
import {FindQueryPre} from "./middleware/FindScreen.query.middleware.js";

/**
 * Schema
 */

const ScreenSchema = new Schema<IScreen>({
    name: {
        type: String,
        maxLength: [255, "Name must be 255 characters or less."],
        required: true,
    },

    theatre: {
        type: Schema.Types.ObjectId,
        ref: 'Theatre',
        required: [true, "Theatre is required."]
    },

    capacity: {
        type: Number,
        gt: [0, "Capacity must be greater than 0."],
        required: [true, "Capacity is required."],
    },

    screenType: {
        type: String,
        enum: ScreenTypeConstant,
        default: '2D',
        required: [true, "Screen Type is required."],
    }
}, {timestamps: true});

/**
 * Virtuals
 */

ScreenSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

ScreenSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

ScreenSchema.plugin(mongooseLeanVirtuals);

/**
 * Middleware
 */

ScreenSchema.pre(["find", "findOne", "findOneAndUpdate"], {document: false, query: true}, FindQueryPre);
ScreenSchema.post("deleteOne", {document: true, query: false}, DeleteOneDocumentPost);
ScreenSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteQueryPost);

const Screen: Model<IScreen> = model<IScreen>("Screen", ScreenSchema);
export default Screen;