import type {Query} from "mongoose";
import type {IScreen} from "../../interface/IScreen.js";
import Showing from "../../../showing/model/Showing.model.js";
import Seat from "../../../seat/model/Seat.model.js";
import Theatre from "../../../theatre/model/Theatre.model.js";

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