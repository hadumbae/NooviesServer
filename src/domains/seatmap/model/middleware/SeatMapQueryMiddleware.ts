import type ISeatMap from "../ISeatMap.js";
import Showing from "../../../showing/model/Showing.model.js";
import type {Query} from "mongoose";
import SeatMap from "../SeatMap.js";

/**
 * Update Middleware
 */

export async function FindOneAndUpdateSeatMapQueryPreMiddleware(this: Query<any, ISeatMap>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Showing.updateMany({seating: _id}, {$pull: {seating: _id}});

    const seatMap = await SeatMap.findById(_id);
    if (!seatMap) return;

    (this as any)._seatMap = seatMap;
}

export async function FindOneAndUpdateSeatMapQueryPostMiddleware(this: Query<any, ISeatMap>) {
    if (!(this as any)._wasUpdated) {
        (this as any)._wasUpdated = true;

        const seatMap = (this as any)._seatMap;
        if (!seatMap) return;

        await Promise.all([
            Showing.updateMany({seating: seatMap!._id}, {$pull: {seating: seatMap!._id}}),
            Showing.updateOne({_id: seatMap!._id}, {$push: {seating: seatMap!}}),
        ]);

    }
}

export async function DeleteSeatMapQueryPostMiddleware(this: Query<any, ISeatMap>) {
    const {_id} = this.getFilter();
    await Showing.updateMany({}, {$pull: {seating: _id}});
}