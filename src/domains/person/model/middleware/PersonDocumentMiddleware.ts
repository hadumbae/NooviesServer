import type {HydratedDocument} from "mongoose";
import type {IPerson} from "../IPerson.js";
import Movie from "../../../movie/model/Movie.js";

export async function DeletePersonDocumentPreMiddleware(this: HydratedDocument<IPerson>) {
    const {_id} = this;
    await Movie.updateMany(
        {$or: [{directors: _id}, {cast: _id}]},
        {$pull: {directors: _id, cast: _id}}
    );
}