/**
 * @file createMovieSnapshot.ts
 *
 * Factory function for creating an immutable movie snapshot.
 *
 * Fetches a fully populated {@link MovieModel} document and transforms it
 * into a validated snapshot suitable for embedding in reservations,
 * tickets, and historical records.
 *
 * @remarks
 * This function enforces strict internal consistency guarantees:
 * - Missing source documents result in {@link DocumentNotFoundError}
 * - Invalid or corrupted persisted data results in {@link InconsistentDataError}
 *
 * Snapshots produced here are intended to be write-once and must never
 * be mutated after creation.
 */

import MovieModel from "../../model/Movie.model.js";
import type {MovieSnapshotSchemaFields} from "../../model/movie-snapshot/MovieSnapshot.types.js";
import {Types} from "mongoose";
import {DocumentNotFoundError} from "../../../../shared/errors/DocumentNotFoundError.js";
import {MovieSnapshotInputSchema} from "../../schema/MovieSnapshotInputSchema.js";
import {InconsistentDataError} from "../../../../shared/errors/InconsistentDataError.js";
import {MovieSnapshot} from "../../model/movie-snapshot/MovieSnapshot.model.js";
import type {GenreSchemaFields} from "../../../genre/model/Genre.types.js";
import type {MovieSchemaFields} from "../../model/Movie.types.js";

/**
 * Internal helper type representing a movie document
 * populated with its genre relations.
 *
 * @internal
 */
interface MovieWithGenres extends MovieSchemaFields {
    genres: GenreSchemaFields[];
}

/**
 * Create an immutable snapshot of a movie.
 *
 * @remarks
 * This operation performs a defensive read of persisted movie data and
 * validates it against the snapshot input schema before constructing
 * the snapshot instance. Any inconsistencies indicate a violation of
 * internal invariants rather than user input errors.
 *
 * @param movieID - ObjectId of the source movie document
 *
 * @returns A validated, immutable {@link MovieSnapshotSchemaFields} instance
 *
 * @throws {@link DocumentNotFoundError}
 * Thrown when the source movie document cannot be found.
 *
 * @throws {@link InconsistentDataError}
 * Thrown when the source movie data fails snapshot validation.
 */
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
