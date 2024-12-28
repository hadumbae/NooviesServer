import {Schema, Model, model} from "mongoose";
import type {IScreen} from "./ScreenModel.interfaces.js";
import ScreenTypeConstant from "../constant/ScreenTypeConstant.js";

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
        validate: (seats: any) => Array.isArray(seats) && seats.length > 0,
    },

    screenType: {
        type: String,
        enum: ScreenTypeConstant,
        default: '2D',
        required: [true, "Screen Type is required."],
    },
}, {timestamps: true});

const Screen: Model<IScreen> = model<IScreen>("Screen", ScreenSchema);
export default Screen;