import type {Query} from "mongoose";
import type ITheatre from "../ITheatre.js";
import Screen from "../../../screen/model/Screen.js";
import Showing from "../../../showing/model/Showing.js";
import Seat from "../../../seat/model/Seat.model.js";

export async function DeleteQueryPost(this: Query<any, ITheatre>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Promise.all([
        Screen.deleteMany({theatre: _id}),
        Seat.deleteMany({theatre: _id}),
        Showing.deleteMany({theatre: _id}),
    ]);

}