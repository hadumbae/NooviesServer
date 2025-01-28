import {Model, model, Schema} from "mongoose";
import type ISeatMap from "./ISeatMap.js";
import {SaveSeatDocumentPostMiddleware} from "../../seat/model/SeatMiddleware.js";
import {DeleteOneSeatMapDocumentPostMiddleware, DeleteSeatMapQueryPostMiddleware} from "./SeatMapMiddleware.js";

const SeatMapSchema = new Schema<ISeatMap>({
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Showing is required."],
    },
    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },
    price: {
        type: Number,
        gt: [0, "Price must be greater than 0."],
        required: [true, "Price is required."],
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: [true, "Is Available is required."],
    },
    isReserved: {
        type: Boolean,
        default: false,
        required: [true, "Is Reserved is required."],
    },
});

SeatMapSchema.post("save", {document: true, query: false}, SaveSeatDocumentPostMiddleware);
SeatMapSchema.post("deleteOne", {document: true, query: false}, DeleteOneSeatMapDocumentPostMiddleware);
SeatMapSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteSeatMapQueryPostMiddleware);

const SeatMap: Model<ISeatMap> = model<ISeatMap>("SeatMap", SeatMapSchema);
export default SeatMap;