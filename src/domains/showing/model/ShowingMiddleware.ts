import type IShowing from "./IShowing.js";
import SeatMapService from "../../seatmap/service/SeatMapService.js";
import Movie from "../../movie/model/Movie.js";
import type {Query} from "mongoose";
import SeatMap from "../../seatmap/model/SeatMap.js";

export async function SaveShowingDocumentPostMiddleware(this: IShowing) {
    if (this.wasNew) {
        const service = new SeatMapService();
        await service.createShowingSeatMap({showingID: this._id.toString()});
    }

    await Movie.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {showings: this._id}}}},
        {updateOne: {filter: {_id: this.movie}, update: {$push: {showings: this}}}},
    ]);
}

export async function DeleteOneShowingDocumentPostMiddleware(this: IShowing) {
    await Movie.updateMany({}, {$pull: {showings: this._id}});
    await SeatMap.deleteMany({showing: this._id});
}

export async function DeleteShowingQueryPostMiddleware(this: Query<any, IShowing>) {
    const {_id: showingID} = this.getFilter();
    await Movie.updateMany({}, {$pull: {showings: showingID}});
    await SeatMap.deleteMany({showing: showingID});
}