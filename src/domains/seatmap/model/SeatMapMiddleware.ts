import type ISeatMap from "./ISeatMap.js";
import Showing from "../../showing/model/Showing.js";
import type {Query} from "mongoose";

export async function SaveSeatMapDocumentPostMiddleware(this: ISeatMap) {
    await Showing.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {seats: this._id}}}},
        {updateOne: {filter: {_id: this.showing}, update: {$push: {seatMap: this}}}},
    ]);
}

export async function DeleteOneSeatMapDocumentPostMiddleware(this: ISeatMap) {
    await Showing.updateMany({}, {$pull: {seating: this._id}});
}

export async function DeleteSeatMapQueryPostMiddleware(this: Query<any, ISeatMap>) {
    const {_id} = this.getFilter();
    await Showing.updateMany({}, {$pull: {seating: _id}});
}