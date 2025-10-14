// Add Movie To User's Favourites
// Remove Movie From User's Favourites

// Fetch Movie With Favourites
//  - Fetch User
//  - Fetch Movie
//  - Fetch Showings

import MovieModel from "../../model/Movie.model.js";
import type IMovie from "../../model/Movie.interface.js";
import {Types} from "mongoose";
import createHttpError from "http-errors";
import User from "@models/User.js";
import Showing from "../../../showing/model/Showing.model.js";
import type IShowing from "../../../showing/model/IShowing.js";

interface UserMovieParams {
    userID: Types.ObjectId | string;
    movieID: Types.ObjectId | string;
}

interface IMovieFavouriteService {
    addMovieToFavourite(params: UserMovieParams): Promise<IMovie>;

    removeMovieFromFavourite(params: UserMovieParams): Promise<IMovie>;

    fetchMovieWithDetails(params: UserMovieParams): Promise<{ showings: IShowing[], movie: IMovie }>;
}

export default class MovieFavouriteService implements IMovieFavouriteService {
    async addMovieToFavourite({userID, movieID}: UserMovieParams): Promise<IMovie> {
        const movie = await MovieModel.findById(movieID).lean();
        if (!movie) throw createHttpError(404, "Movie not found!");

        const res = await User.findByIdAndUpdate(
            userID,
            {$addToSet: {favourites: movie}},
            {new: true, select: "_id favourites"},
        ).lean();

        if (!res) throw createHttpError(404, "User not found!");

        return movie;
    }

    async removeMovieFromFavourite({userID, movieID}: UserMovieParams): Promise<IMovie> {
        const movie = await MovieModel.findById(movieID).lean();
        if (!movie) throw createHttpError(404, "Movie not found!");

        console.log("movie: ", movie._id);

        const res = await User.findByIdAndUpdate(
            userID,
            {$pull: {favourites: movie._id}},
            {new: true, select: "_id"}
        ).lean();

        if (!res) throw createHttpError(404, "User not found!");

        return movie;
    }

    async fetchMovieWithDetails({userID, movieID}: UserMovieParams): Promise<{ showings: IShowing[], movie: IMovie }> {
        const [user, movie] = await Promise.all([
            User.findById(userID).select("_id favourites").lean(),
            MovieModel.findById(movieID).populate(["genres"]).lean(),
        ]);

        if (!user) throw createHttpError(404, "User not found!");
        if (!movie) throw createHttpError(404, "Movie not found!");

        const favSet = new Set(user.favourites.map((m) => m._id.toString()));
        const movieWithFlag = {...movie, isFavourite: favSet.has(movie._id.toString())};

        const showings = await Showing
            .find({movie: movie._id, isActive: true})
            .populate("theatre")
            .populate("screen")
            .populate({path: "seating", populate: {path: "seat"}})
            .lean();

        return {showings, movie: movieWithFlag};
    }
}