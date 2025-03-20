import type {Query} from "mongoose";
import type {IPerson} from "../IPerson.js";
import Movie from "../../../movie/model/Movie.js";
import Person from "../Person.js";
import movie from "../../../movie/model/Movie.js";

export async function DeletePersonQueryPreMiddleware(this: Query<any, IPerson>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Movie.updateMany({$or: [{directors: _id}, {cast: _id}]}, {$pull: {directors: _id, cast: _id}});
}