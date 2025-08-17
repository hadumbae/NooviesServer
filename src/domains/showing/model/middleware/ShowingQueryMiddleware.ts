import type IShowing from "../IShowing.js";
import MovieModel from "../../../movie/model/Movie.model.js";
import type {Query} from "mongoose";

import Showing from "../Showing.js";
import SeatMap from "../../../seatmap/model/SeatMap.js";
import Screen from "../../../screen/model/Screen.js";

export async function UpdateShowingQueryPreMiddleware(this: Query<any, IShowing>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    const showing = await Showing.findById(_id);
    if (!showing) return;

    (this as any)._showing = showing;

    await Promise.all([
        MovieModel.updateMany({showings: showing._id}, {$pull: {showings: showing._id}}),
        Screen.updateMany({showings: showing._id}, {$pull: {showings: showing._id}}),
    ]);
}

export async function UpdateShowingQueryPostMiddleware(this: Query<any, IShowing>) {
    const showing = (this as any)._showing;
    if (!showing) return;

    await Promise.all([
        MovieModel.findByIdAndUpdate(showing.movie, {$push: {showings: showing}}),
        Screen.findByIdAndUpdate(showing.screen, {$push: {showings: showing}}),
    ]);
}

export async function DeleteShowingQueryPreMiddleware(this: Query<any, IShowing>) {
    const {_id: showingID} = this.getFilter();

    await Promise.all([
        MovieModel.updateMany({}, {$pull: {showings: showingID}}),
        Screen.updateMany({}, {$pull: {showings: showingID}}),
        SeatMap.deleteMany({showing: showingID})
    ]);

}