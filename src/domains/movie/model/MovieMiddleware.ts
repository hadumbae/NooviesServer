import Person from "../../person/model/Person.js";
import Genre from "../../genre/model/Genre.js";
import type IMovie from "./IMovie.js";
import Showing from "../../showing/model/Showing.js";
import type {Query} from "mongoose";
import type {IScreen} from "../../screen/model/IScreen.js";

// Save Movie Document Post Middleware

// Save - Type
// Movie - Model
// Document - Query/Document
// Post - Pre/Post
// Middleware

/**
 * Document Middleware
 */

// Save
export async function SaveMovieDocumentPostMiddleware(this: IMovie) {
    const personIDs = [...(new Set([...this.directors, ...this.cast]))];

    await Person.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {movie: this._id}}}},
        {updateMany: {filter: {_id: {$in: personIDs}}, update: {$push: {movies: this}}}},
    ]);

    await Genre.bulkWrite([
        {updateMany: {filter: {}, update: {$pull: {movie: this._id}}}},
        {updateMany: {filter: {_id: {$in: this.genres}}, update: {$push: {movies: this}}}},
    ]);
}

// Delete
export async function DeleteOneMovieDocumentPostMiddleware (this: IMovie) {
    await Person.updateMany({}, {$pull: {movies: this._id}});
    await Genre.updateMany({}, {$pull: {movies: this._id}});
    await Showing.deleteMany({movie: this._id});
}

/**
 * Query Middleware
 */

// Delete
export async function DeleteMovieQueryPostMiddleware (this: Query<any, IScreen>) {
    const {_id} = this.getFilter();
    await Person.updateMany({}, {$pull: {movies: _id}});
    await Genre.updateMany({}, {$pull: {movies: _id}});
    await Showing.deleteMany({movie: _id});
}