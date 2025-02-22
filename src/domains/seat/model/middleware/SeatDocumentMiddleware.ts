import Theatre from "../../../theatre/model/Theatre.js";
import Screen from "../../../screen/model/Screen.js";
import type ISeat from "../ISeat.js";
import type {HydratedDocument} from "mongoose";

/**
 * Save Middleware
 */

export async function SaveSeatDocumentPreMiddleware(this: HydratedDocument<ISeat>) {
    (this as any)._wasNew = this.isNew;
}

export async function SaveSeatDocumentPostMiddleware(this: HydratedDocument<ISeat>) {
    if ((this as any)._wasNew) {
        (this as any)._wasUpdated = true;

        await Theatre.findByIdAndUpdate(this.theatre, {$push: {seats: this}});
        await Screen.findByIdAndUpdate(this.screen, {$push: {seats: this}});
    }
}


/**
 * Delete Middleware
 */

export async function DeleteOneSeatDocumentPreMiddleware (this: HydratedDocument<ISeat>) {
    await Screen.updateMany({}, {$pull: {seats: this}});
    await Theatre.updateMany({}, {$pull: {seats: this}, $inc: {seatCapacity: -1}});
}

