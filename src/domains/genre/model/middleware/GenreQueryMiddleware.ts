import type {Query} from "mongoose";

import type IGenre from "../IGenre.js";
import Movie from "../../../movie/model/Movie.js";

export async function DeleteGenreQueryPreMiddleware(this: Query<any, IGenre>) {
    const {_id} = this.getFilter();
    await Movie.deleteMany({genre: _id}).exec();
}