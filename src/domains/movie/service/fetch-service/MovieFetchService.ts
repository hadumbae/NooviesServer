/**
 * @file Fetch a Movie or throw if not found.
 * MovieFetchService.ts
 */

import type {FetchRequiredMovieParams} from "./MovieFetchService.types.js";
import MovieModel from "../../model/Movie.model.js";
import {buildIdOrSlugFilter} from "../../../../shared/utility/mongoose/buildIdOrSlugFilter.js";
import type {MovieDocument} from "../../type/MovieTypes.js";

/**
 * Retrieves a Movie by `_id` or `slug`, rejecting if none matches.
 *
 * @param params - Fetch criteria and query options
 */
export const fetchRequiredMovie = ({_id, select, lean}: FetchRequiredMovieParams): Promise<MovieDocument> => {
    const filters = buildIdOrSlugFilter(_id);
    const query = MovieModel.findOne(filters)

    if (select) query.select(select);
    if (lean) query.lean();

    return query.orFail()
}