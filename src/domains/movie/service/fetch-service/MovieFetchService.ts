/**
 * @file Fetch Movie documents by identifier or slug.
 * MovieFetchService.ts
 */

import type { FetchRequiredMovieBySlugParams, FetchRequiredMovieParams } from "./MovieFetchService.types.js";
import MovieModel from "../../model/Movie.model.js";
import type { MovieDocument } from "../../type/MovieTypes.js";

/**
 * Retrieves a Movie by `_id`, rejecting if not found.
 *
 * @param params - Identifier and query options
 */
export const fetchRequiredMovie = (
    { _id, options: { select, lean } = {} }: FetchRequiredMovieParams
): Promise<MovieDocument> => {
    const query = MovieModel.findById(_id)

    if (select) query.select(select);
    if (lean) query.lean();

    return query.orFail()
}

/**
 * Retrieves a Movie by `slug`, rejecting if not found.
 *
 * @param params - Slug and query options
 */
export const fetchRequiredMovieBySlug = (
    { slug, options: { select, lean } = {} }: FetchRequiredMovieBySlugParams
): Promise<MovieDocument> => {
    const query = MovieModel.findOne({ slug });

    if (select) query.select(select);
    if (lean) query.lean();

    return query.orFail()
}