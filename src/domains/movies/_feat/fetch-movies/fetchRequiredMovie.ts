/**
 * @fileoverview Service for retrieving a specific movie document from the database.
 */

import {Movie} from "@/domains/movies/_models/movie/Movie.model";
import {fetchOrFailQuery} from "@/shared/utility/mongoose/fetchOrFailQuery";
import {Types} from "mongoose";
import type {DocumentType} from "@/shared/types/mongoose/DocumentType";
import type {MovieSchemaFields} from "@/domains/movies/_models/movie/Movie.types";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import type {QueryConfig} from "@/shared/_types";
import populateQuery from "@/shared/utility/mongoose/populateQuery";

/** Parameters for fetching a required Movie by its unique identifier. */
export type FetchRequiredMovieConfig = {
    options?: Omit<QueryConfig, "limit">
} & (
    | { _id: Types.ObjectId, slug?: never }
    | { _id?: never, slug: SlugString }
);

/** Retrieves a Movie by its ID and throws a 404 error if the document does not exist. */
export const fetchRequiredMovie = async (
    {_id, slug, options = {}}: FetchRequiredMovieConfig
): Promise<DocumentType<MovieSchemaFields>> => {
    const query = populateQuery({
        query: _id ? Movie.findById(_id) : Movie.findOne({slug}),
        config: options
    });

    return fetchOrFailQuery({
        query,
        httpCode: 404,
        errorMessage: "Movie Not Found.",
    });
}