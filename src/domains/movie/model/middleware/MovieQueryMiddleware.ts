import Genre from "../../../genre/model/Genre.js";
import Showing from "../../../showing/model/Showing.js";
import type {Query} from "mongoose";
import type IMovie from "../IMovie.js";
import Movie from "../Movie.js";
import User from "@models/User.js";

export async function FindOneAndUpdateMovieQueryPreMiddleware(this: Query<any, IMovie>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    const movie = await Movie.findById(_id);
    if (!movie) return;

    (this as any)._movie = movie;

    await Genre.updateMany({movies: _id}, {$pull: {movies: movie._id}});
}

export async function FindOneAndUpdateMovieQueryPostMiddleware(this: Query<any, IMovie>) {
    const movie = (this as any)._movie;
    if (!movie) return;

    const {genres} = movie;

    await Genre.updateMany({_id: {$in: genres}}, {$push: {movies: movie}});
}

export async function DeleteMovieQueryPostMiddleware(this: Query<any, IMovie>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Promise.all([
        User.updateMany({favourites: _id}, {$pull: {favourites: _id}}),
        Genre.updateMany({movies: _id}, {$pull: {movies: _id}}),
        Showing.deleteMany({movie: _id}),
    ]);
}