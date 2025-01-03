import Screen from "../../screen/model/Screen.js";
import Seat from "../../seat/model/Seat.js";
import Showing from "../../showing/model/Showing.js";
import type {Query} from "mongoose";
import type ITheatre from "./ITheatre.js";

export async function DeleteOneTheatreDocumentPostMiddleware(this: ITheatre) {
    await Screen.deleteMany({theatre: this._id});
    await Seat.deleteMany({theatre: this._id});
    await Showing.deleteMany({theatre: this._id});
}

export async function DeleteTheatreQueryPostMiddleware(this: Query<any, ITheatre>) {
    const {_id} = this.getFilter();
    await Screen.deleteMany({theatre: _id});
    await Seat.deleteMany({theatre: _id});
    await Showing.deleteMany({theatre: _id});
}