/**
 * @fileoverview Service for retrieving a specific movie document from the database.
 */

import {Movie} from "@domains/movie/model/movie/Movie.model";
import {fetchOrFailQuery} from "@shared/utility/mongoose/fetchOrFailQuery";
import {Types} from "mongoose";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {MovieSchemaFields} from "@domains/movie/model/movie/Movie.types";

/** Query modifiers for Movie fetches. */
type FetchMovieQueryOptions = {
    lean?: boolean;
    select?: string;
};

/** Parameters for fetching a required Movie by its unique identifier. */
export type FetchRequiredMovieConfig = {
    _id: Types.ObjectId;
    options?: FetchMovieQueryOptions
};

/** Retrieves a Movie by its ID and throws a 404 error if the document does not exist. */
export const fetchRequiredMovie = async (
    {_id, options: {select, lean} = {}}: FetchRequiredMovieConfig
): Promise<DocumentType<MovieSchemaFields>> => {
    const query = Movie.findById(_id)

    if (select) query.select(select);
    if (lean) query.lean();

    return fetchOrFailQuery({
        query,
        httpCode: 404,
        errorMessage: "Movie Not Found.",
    });
}