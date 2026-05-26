/**
 * @file Fetches a required movie by identifier with optional population settings.
 * @filename fetchRequiredMovie.ts
 */

import type {RequestOptions} from "@shared/types/request-options/RequestOptions";
import {Types} from "mongoose";
import populateQuery from "../../../../shared/utility/mongoose/populateQuery.js";
import {Movie} from "@domains/movie/model/movie/Movie.model";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {MovieSchemaFields} from "@domains/movie/model/movie/Movie.types";

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
): Promise<DocumentType<MovieSchemaFields>> {
    const query = _id
        ? Movie.findById(_id)
        : Movie.findOne({slug});

    const movie = populateQuery({query, options});
    return movie.orFail();
}