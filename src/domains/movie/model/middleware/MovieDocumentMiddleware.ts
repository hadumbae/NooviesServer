import type IMovie from "../IMovie.js";
import Person from "../../../person/model/Person.js";
import Genre from "../../../genre/model/Genre.js";
import Showing from "../../../showing/model/Showing.js";
import type {HydratedDocument} from "mongoose";

export async function SaveMovieDocumentPreMiddleware(this: HydratedDocument<IMovie>) {
    (this as any)._wasNew = this.isNew;
}

export async function SaveMovieDocumentPostMiddleware(this: IMovie) {
    if ((this as any)._wasNew) {
        const {_id, directors, cast, genres} = this;
        const personIDs = [...(new Set([...directors, ...cast]))];

        await Promise.all([
            Person.updateMany({_id: {$in: personIDs}}, {$push: {movies: _id}}),
            Genre.updateMany({_id: {$in: genres}}, {$push: {movies: this}}),
        ]);
    }
}

export async function DeleteOneMovieDocumentPreMiddleware(this: HydratedDocument<IMovie>) {
    const {_id} = this;
    (this as any)._wasUpdated = true;

    await Promise.all([
        Person.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Genre.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Showing.deleteMany({movie: _id}),
    ]);
}