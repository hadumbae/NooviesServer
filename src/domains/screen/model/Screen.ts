import {Schema, Model, model} from "mongoose";
import type {IScreen} from "../interface/IScreen.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";

import {
    SaveScreenDocumentPreMiddleware,
    SaveScreenDocumentPostMiddleware,
    DeleteOneScreenDocumentPostMiddleware,
} from "./middleware/ScreenDocumentMiddleware.js";

import {
    DeleteScreenQueryPostMiddleware,
    FindOneAndUpdateScreenQueryPreMiddleware,
    FindOneAndUpdateScreenQueryPostMiddleware,
} from "./middleware/ScreenQueryMiddleware.js";

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

    seats: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
        required: true,
    },

    screenType: {
        type: String,
        enum: ScreenTypeConstant,
        default: '2D',
        required: [true, "Screen Type is required."],
    },

    showings: {
        type: [{type: Schema.Types.ObjectId, ref: "Showing"}],
        required: [true, "Showings is required."],
    }
}, {timestamps: true});

/**
 * Middleware
 */

ScreenSchema.pre("save", {document: true, query: false}, SaveScreenDocumentPreMiddleware);
ScreenSchema.post("save", {document: true, query: false}, SaveScreenDocumentPostMiddleware);

ScreenSchema.pre("findOneAndUpdate", {document: false, query: true}, FindOneAndUpdateScreenQueryPreMiddleware);
ScreenSchema.post("findOneAndUpdate", {document: false, query: true}, FindOneAndUpdateScreenQueryPostMiddleware);

ScreenSchema.post("deleteOne", {document: true, query: false}, DeleteOneScreenDocumentPostMiddleware);
ScreenSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteScreenQueryPostMiddleware);

const Screen: Model<IScreen> = model<IScreen>("Screen", ScreenSchema);
export default Screen;