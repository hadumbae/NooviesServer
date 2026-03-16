/**
 * @file Fetches a required movie by identifier with optional population settings.
 * @filename fetchRequiredMovie.ts
 */

import type {RequestOptions} from "../../../../shared/types/request-options/RequestOptions.js";
import {Types} from "mongoose";
import populateQuery from "../../../../shared/utility/mongoose/populateQuery.js";
import MovieModel from "../../model/Movie.model.js";
import type {SlugString} from "../../../../shared/schema/strings/SlugStringSchema.js";
import type {MovieDocument} from "../../type/MovieTypes.js";

/**
 * Parameters for fetching a required movie.
 * Accepts either a database identifier or a slug.
 */
type FetchParams = {
    options?: Omit<RequestOptions, "limit">
} & (
    /** Fetch by MongoDB identifier */
    | { _id: Types.ObjectId, slug?: never }
    /** Fetch by unique slug */
    | { _id?: never, slug: SlugString }
    );

/**
 * Fetches a movie with optional population and virtual configuration.
 * Throws if no document is found.
 */
export function fetchRequiredMovie(
    {_id, slug, options}: FetchParams,
): Promise<MovieDocument> {
    const query = _id
        ? MovieModel.findById(_id)
        : MovieModel.findOne({slug});

    const movie = populateQuery({query, options});
    return movie.orFail();
}