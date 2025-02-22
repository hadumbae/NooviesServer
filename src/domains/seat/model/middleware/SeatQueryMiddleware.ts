import type {Query} from "mongoose";
import type ISeat from "../ISeat.js";
import Theatre from "../../../theatre/model/Theatre.js";
import Screen from "../../../screen/model/Screen.js";
import Seat from "../Seat.js";

export async function FindOneAndUpdateSeatQueryPreMiddleware(this: Query<any, ISeat>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    const seat = await Seat.findById(_id);
    if (!seat) return;

    (this as any)._seat = seat;

    await Promise.all([
        Theatre.updateMany({seats: seat._id}, {$pull: {seats: seat._id}}),
        Screen.updateMany({seats: seat._id}, {$pull: {seats: seat._id}}),
    ]);
}

export async function FindOneAndUpdateSeatQueryPostMiddleware(this: Query<any, ISeat>) {
    const seat = (this as any)._seat;

    if (seat && !(this as any)._wasUpdated) {
        await Promise.all([
            Theatre.updateOne({_id: seat.theatre}, {$push: {seats: seat}}),
            Screen.updateOne({_id: seat.screen}, {$push: {seats: seat}}),
        ]);
    }
}

export async function DeleteSeatQueryPreMiddleware(this: Query<any, ISeat>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Promise.all([
        Theatre.updateMany({seats: _id}, {$pull: {seats: _id}}),
        Screen.updateMany({seats: _id}, {$pull: {seats: _id}}),
    ]);

}