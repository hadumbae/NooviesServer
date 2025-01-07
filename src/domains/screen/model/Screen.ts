import {Schema, Model, model} from "mongoose";
import type {IScreen} from "./IScreen.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";
import {
    DeleteOneScreenDocumentPostMiddleware,
    DeleteScreenQueryPostMiddleware,
    SaveScreenDocumentPostMiddleware
} from "./ScreenMiddleware.js";

const ScreenSchema: Schema<IScreen> = new Schema<IScreen>({
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
}, {timestamps: true});

ScreenSchema.post("save", {document: true, query: false}, SaveScreenDocumentPostMiddleware);
ScreenSchema.post("deleteOne", {document: true, query: false}, DeleteOneScreenDocumentPostMiddleware);
ScreenSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteScreenQueryPostMiddleware);

const Screen: Model<IScreen> = model<IScreen>("Screen", ScreenSchema);
export default Screen;