import type IShowing from "../IShowing.js";
import Movie from "../../../movie/model/Movie.js";
import SeatMap from "../../../seatmap/model/SeatMap.js";
import SeatMapService from "../../../seatmap/service/SeatMapService.js";
import type {HydratedDocument} from "mongoose";

export async function SaveShowingDocumentPreMiddleware(this: HydratedDocument<IShowing>) {
    (this as any)._wasNew = this.isNew;
}

export async function SaveShowingDocumentPostMiddleware(this: HydratedDocument<IShowing>) {
    const {_id} = this;
    if (!_id) return;

    if (this.wasNew) {
        const service = new SeatMapService();
        await service.createShowingSeatMap({showingID: this._id.toString()});
    }
}

export async function DeleteOneShowingDocumentPreMiddleware(this: IShowing) {
    const {_id} = this;
    if (!_id) return;

    await Promise.all([
        Movie.updateMany({}, {$pull: {showings: this._id}}),
        SeatMap.deleteMany({showing: this._id}),
    ]);
}