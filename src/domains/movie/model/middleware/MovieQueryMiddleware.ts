import Person from "../../../person/model/Person.js";
import Genre from "../../../genre/model/Genre.js";
import Showing from "../../../showing/model/Showing.js";
import type {Query} from "mongoose";
import type IMovie from "../IMovie.js";
import Movie from "../Movie.js";

export async function FindOneAndUpdateMovieQueryPreMiddleware(this: Query<any, IMovie>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    const movie = await Movie.findById(_id);
    if (!movie) return;

    await Promise.all([
        Person.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Genre.updateMany({movies: _id}, {$pull: {movies: _id}}),
    ]);

    (this as any)._movie = movie;
}

export async function FindOneAndUpdateMovieQueryPostMiddleware(this: Query<any, IMovie>) {
    const movie = (this as any)._movie;
    if (!movie) return;

    const {_id, directors, cast, genres} = movie;
    const personIDs = [...(new Set([...directors, ...cast]))];

    await Promise.all([
        Person.updateMany({_id: {$in: personIDs}}, {$push: {movies: _id}}),
        Genre.updateMany({_id: {$in: genres}}, {$push: {movies: this}}),
    ]);

}

export async function DeleteMovieQueryPostMiddleware(this: Query<any, IMovie>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Promise.all([
        Person.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Genre.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Showing.deleteMany({movie: _id}),
    ]);

}