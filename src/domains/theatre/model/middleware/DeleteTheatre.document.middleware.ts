import type ITheatre from "../ITheatre.js";
import Screen from "../../../screen/model/Screen.js";
import Showing from "../../../showing/model/Showing.js";
import Seat from "../../../seat/model/Seat.model.js";

export async function DeleteDocumentPost(this: ITheatre) {
    await Promise.all([
        Screen.deleteMany({theatre: this._id}),
        Seat.deleteMany({theatre: this._id}),
        Showing.deleteMany({theatre: this._id}),
    ]);
}