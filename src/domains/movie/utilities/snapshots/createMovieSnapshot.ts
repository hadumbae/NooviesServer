/**
 * @fileoverview Utility for generating immutable movie snapshots for historical records.
 */

import MovieModel from "../../model/Movie.model.js";
import type {MovieSnapshotSchemaFields} from "../../model/movie-snapshot/MovieSnapshot.types.js";
import {Types} from "mongoose";
import {DocumentNotFoundError} from "@shared/errors/DocumentNotFoundError";
import {InconsistentDataError} from "@shared/errors/InconsistentDataError";
import {MovieSnapshot} from "../../model/movie-snapshot/MovieSnapshot.model.js";
import type {MovieWithGenres} from "../../model/Movie.types.js";
import {MovieSnapshotInputSchema} from "@domains/movie/_feat/validate-submit";

/** Fetches a movie by ID and validates its data against the snapshot schema. */
export async function createMovieSnapshot(
    movieID: Types.ObjectId
): Promise<MovieSnapshotSchemaFields> {
    const movie = await MovieModel.findById(movieID).populate(["genres"]).lean();

    if (!movie) {
        throw new DocumentNotFoundError({
            model: MovieModel,
            identifier: movieID,
            message: "Failed to fetch Movie for snapshot.",
        });
    }

    const {posterImage, genres} = movie as MovieWithGenres;
    const {data, success, error} = MovieSnapshotInputSchema.safeParse({
        ...movie,
        posterURL: posterImage?.secure_url,
        genres: genres.map(({name}) => name),
    });

    if (!success) {
        throw new InconsistentDataError({
            modelName: MovieSnapshot.name,
            message: "Inconsistent data, unable to create snapshot.",
            errors: error?.errors,
        });
    }

    return data;
}
