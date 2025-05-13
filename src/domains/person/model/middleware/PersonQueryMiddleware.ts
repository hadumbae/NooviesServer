import type {Query} from "mongoose";
import type {IPerson} from "../IPerson.js";
import Movie from "../../../movie/model/Movie.js";

export async function DeletePersonQueryPreMiddleware(this: Query<any, IPerson>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Movie.updateMany({$or: [{staff: _id}, {cast: _id}]}, {$pull: {staff: _id, cast: _id}});
}