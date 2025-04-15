// TODO - Add `status` to Showing Schema
//  If `inactive`, prevent modifications to `seatmap` and `reservations`

import {Model, model, Schema} from "mongoose";
import type IShowing from "./IShowing.js";
import {
    DeleteShowingQueryPreMiddleware,
    UpdateShowingQueryPostMiddleware, UpdateShowingQueryPreMiddleware
} from "./middleware/ShowingQueryMiddleware.js";
import {
    DeleteOneShowingDocumentPreMiddleware,
    SaveShowingDocumentPostMiddleware, SaveShowingDocumentPreMiddleware
} from "./middleware/ShowingDocumentMiddleware.js";

const ShowingSchema = new Schema<IShowing>({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },

    theatre: {
        type: Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },

    screen: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },

    startTime: {
        type: Date,
        required: [true, "Start Time is required."],
    },

    endTime: {
        type: Date,
        default: null,
        required: false,
    },

    seating: {
        type: [{type: Schema.Types.ObjectId, ref: "SeatMap"}],
        required: true,
    },

    ticketPrice: {
        type: Number,
        gt: [0, "Ticket Price must be greater than 0."],
        required: true
    },

    language: {
        type: String,
        required: true
    },

    subtitleLanguages: {
        type: [String],
        required: true,
        validate: (langs: any) => Array.isArray(langs) && langs.length > 0,
    },

    isSpecialEvent: {
        type: Boolean,
        default: false,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
}, {timestamps: true});

ShowingSchema.pre("save", {document: true, query: false}, function (next) {
    this.wasNew = this.isNew;
    next();
});

ShowingSchema.pre("save", {document: true, query: false}, SaveShowingDocumentPreMiddleware);
ShowingSchema.post("save", {document: true, query: false}, SaveShowingDocumentPostMiddleware);

ShowingSchema.pre("findOneAndUpdate", {document: false, query: true}, UpdateShowingQueryPreMiddleware);
ShowingSchema.post("findOneAndUpdate", {document: false, query: true}, UpdateShowingQueryPostMiddleware);

ShowingSchema.post("deleteOne", {document: true, query: false}, DeleteOneShowingDocumentPreMiddleware);
ShowingSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteShowingQueryPreMiddleware);

const Showing: Model<IShowing> = model<IShowing>("Showing", ShowingSchema);
export default Showing;