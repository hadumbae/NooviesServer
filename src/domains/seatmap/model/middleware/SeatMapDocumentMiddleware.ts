/**
 * Create Middleware
 */
import type ISeatMap from "../ISeatMap.js";
import Showing from "../../../showing/model/Showing.js";
import type {HydratedDocument} from "mongoose";

export async function SaveSeatMapDocumentPreMiddleware(this: HydratedDocument<ISeatMap>) {
    (this as any)._wasNew = this.isNew;
}

export async function SaveSeatMapDocumentPostMiddleware(this: ISeatMap) {
    if ((this as any)._wasNew) {
        (this as any)._wasUpdated = true;
        await Showing.updateOne({_id: this._id}, {$push: {seating: this}});
    }
}

/**
 * Delete Middleware
 */

export async function DeleteOneSeatMapDocumentPostMiddleware(this: ISeatMap) {
    await Showing.updateMany({}, {$pull: {seating: this._id}});
}