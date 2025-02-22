import type {Query} from "mongoose";
import type {IScreen} from "../../interface/IScreen.js";
import Theatre from "../../../theatre/model/Theatre.js";
import Seat from "../../../seat/model/Seat.js";
import Showing from "../../../showing/model/Showing.js";
import Screen from "../Screen.js";

/**
 * Update
 */

export async function FindOneAndUpdateScreenQueryPreMiddleware(this: Query<any, IScreen>) {
    if ((this as any)._wasUpdated) return

    const {_id} = this.getFilter();
    if (!_id) return;

    const screen = await Screen.findById(_id);
    if (!screen) return;

    (this as any)._screenID = _id;
    (this as any)._screen = screen;

    await Theatre.updateMany({screens: _id}, {$pull: {screens: _id}});
}

export async function FindOneAndUpdateScreenQueryPostMiddleware(this: Query<any, IScreen>) {
    if ((this as any)._wasUpdated) return

    const screen = (this as any)._screen;
    if (!screen) return;

    await Theatre.updateOne({_id: screen!.theatre}, {$push: {screens: screen}});
    (this as any)._wasUpdated = true;
}

/**
 * Delete
 */

export async function DeleteScreenQueryPostMiddleware(this: Query<any, IScreen>) {
    const {_id} = this.getFilter();
    (this as any)._wasUpdated = true;

    await Theatre.updateMany({screens: _id}, {$pull: {screens: _id}});
    await Seat.deleteMany({screen: _id});
    await Showing.deleteMany({screen: _id});
}