import {Schema, Model, model} from "mongoose";
import type ISeat from "./ISeat.js";
import SeatTypeConstant from "../constant/SeatTypeConstant.js";

import {
    SaveSeatDocumentPreMiddleware,
    SaveSeatDocumentPostMiddleware,
    DeleteOneSeatDocumentPreMiddleware,
} from "./middleware/SeatDocumentMiddleware.js";

import {
    FindOneAndUpdateSeatQueryPreMiddleware,
    FindOneAndUpdateSeatQueryPostMiddleware,
    DeleteSeatQueryPreMiddleware,
} from "./middleware/SeatQueryMiddleware.js";


const SeatSchema = new Schema<ISeat>({
    theatre: {
        type: Schema.Types.ObjectId,
        ref: 'Theatre',
        required: [true, "Theatre is required."],
    },

    screen: {
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: [true, "Screen is required."],
    },

    row: {
        type: String,
        maxLength: [10, "Row must be 10 characters or less."],
        required: [true, "Row is required."],
    },

    seatNumber: {
        type: Number,
        min: [0, "Seat Number must be 0 or more."],
        required: [true, "Seat Number is required."],
    },

    seatLabel: {
        type: String,
        maxLength: [50, "Seat Label must be 50 characters or less."],
    },

    seatType: {
        type: String,
        enum: SeatTypeConstant,
        default: 'Regular',
        required: [true, "Seat Type is required."],
    },

    isAvailable: {
        type: Boolean,
        required: [true, "Is Available is required."],
    },

    x: {
        type: Number,
        min: [1, "X must be 1 or more."]
    },

    y: {
        type: Number,
        min: [1, "Y must be 1 or more."]
    },

    priceMultiplier: {
        type: Number,
        default: 1.0,
        required: [true, "Price Multiplier is required."],
    },
}, {timestamps: true});

/**
 * Middleware
 */

SeatSchema.pre('save', {document: true, query: false}, SaveSeatDocumentPreMiddleware);
SeatSchema.post('save', {document: true, query: false}, SaveSeatDocumentPostMiddleware);

SeatSchema.pre('findOneAndUpdate', {document: false, query: true}, FindOneAndUpdateSeatQueryPreMiddleware);
SeatSchema.post('findOneAndUpdate', {document: false, query: true}, FindOneAndUpdateSeatQueryPostMiddleware);

SeatSchema.pre('deleteOne', {document: true, query: false}, DeleteOneSeatDocumentPreMiddleware);
SeatSchema.pre(['deleteOne', 'deleteMany'], {document: false, query: true}, DeleteSeatQueryPreMiddleware);

const Seat: Model<ISeat> = model<ISeat>("Seat", SeatSchema);
export default Seat;