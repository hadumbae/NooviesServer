import Theatre from "../../theatre/model/Theatre.js";
import Screen from "../../screen/model/Screen.js";
import type ISeat from "./ISeat.js";
import type {Query} from "mongoose";

export async function SaveSeatDocumentPostMiddleware(this: ISeat) {
    await Theatre.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {seats: this._id}}}},
        {updateOne: {filter: {_id: this.theatre}, update: {$push: {seats: this}, $inc: {numberOfSeats: 1}}}},
    ]);

    await Screen.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {seats: this._id}}}},
        {updateOne: {filter: {_id: this.screen}, update: {$push: {seats: this}}}},
    ]);
}

export async function DeleteOneSeatDocumentPostMiddleware (this: ISeat) {
    await Screen.updateMany({}, {$pull: {seats: this}});
    await Theatre.updateMany({}, {$pull: {seats: this}, $inc: {numberOfSeats: -1}});
}

export async function DeleteSeatQueryPostMiddleware (this: Query<any, ISeat>) {
    const {_id} = this.getFilter();
    await Theatre.updateMany({}, {$pull: {seats: _id}, $inc: {numberOfSeats: -1}});
    await Screen.updateMany({}, {$pull: {seats: _id}});
}