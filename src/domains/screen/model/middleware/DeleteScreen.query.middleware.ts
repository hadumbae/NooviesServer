import type {Query} from "mongoose";
import type {IScreen} from "../../interface/IScreen.js";
import Theatre from "../../../theatre/model/Theatre.js";
import Seat from "../../../seat/model/Seat.js";
import Showing from "../../../showing/model/Showing.js";

/**
 * Delete
 */

export async function DeleteQueryPost(this: Query<any, IScreen>) {
    const {_id} = this.getFilter();
    (this as any)._wasUpdated = true;

    await Theatre.updateMany({screens: _id}, {$pull: {screens: _id}});
    await Seat.deleteMany({screen: _id});
    await Showing.deleteMany({screen: _id});
}