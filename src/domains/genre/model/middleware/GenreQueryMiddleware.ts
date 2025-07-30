import type {Query} from "mongoose";

import type IGenre from "../Genre.interface.js";
import Movie from "../../../movie/model/Movie.js";

export async function DeleteGenreQueryPreMiddleware(this: Query<any, IGenre>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Movie.deleteMany({genre: _id}).exec();
}