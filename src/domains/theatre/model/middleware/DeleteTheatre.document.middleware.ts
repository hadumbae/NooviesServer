import type ITheatre from "../ITheatre.js";
import Screen from "../../../screen/model/Screen.js";
import Seat from "../../../seat/model/Seat.js";
import Showing from "../../../showing/model/Showing.js";

export async function DeleteOneDocumentPost(this: ITheatre) {
    await Promise.all([
        Screen.deleteMany({theatre: this._id}),
        Seat.deleteMany({theatre: this._id}),
        Showing.deleteMany({theatre: this._id}),
    ]);
}