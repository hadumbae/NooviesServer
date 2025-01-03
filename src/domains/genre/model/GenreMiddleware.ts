import Movie from "../../movie/model/Movie.js";
import type {Query} from "mongoose";
import type IGenre from "./IGenre.js";

export async function DeleteGenreDocumentPostMiddleware(this: Query<any, IGenre>) {
    const { _id } = this.getFilter();
    await Movie.deleteMany({genre: _id}).exec();
}