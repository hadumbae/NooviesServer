import Screen from "../../../screen/model/Screen.js";
import Seat from "../../../seat/model/Seat.js";
import Showing from "../../../showing/model/Showing.js";
import type {Query} from "mongoose";
import type ITheatre from "../ITheatre.js";

export async function DeleteOneTheatreDocumentPostMiddleware(this: ITheatre) {
    await Promise.all([
        Screen.deleteMany({theatre: this._id}),
        Seat.deleteMany({theatre: this._id}),
        Showing.deleteMany({theatre: this._id}),
    ]);

}

export async function DeleteTheatreQueryPostMiddleware(this: Query<any, ITheatre>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Promise.all([
        Screen.deleteMany({theatre: _id}),
        Seat.deleteMany({theatre: _id}),
        Showing.deleteMany({theatre: _id}),
    ]);

}