import type {HydratedDocument} from "mongoose";

import type IGenre from "../Genre.interface.js";
import Movie from "../../../movie/model/Movie.js";

export async function DeleteGenreDocumentPreMiddleware(this: HydratedDocument<IGenre>) {
    const { _id } = this;
    await Movie.deleteMany({genre: _id}).exec();
}