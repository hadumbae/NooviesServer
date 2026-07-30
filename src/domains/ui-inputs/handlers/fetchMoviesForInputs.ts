/**
 * @fileoverview Handler for fetching a lean list of movies for UI input selections.
 */

import type {FetchLeanDataConfig} from "@/domains/ui-inputs/handlers/fetchLeanDataConfig";
import type {MovieSchemaFields} from "@/domains/movies/_models/movie/Movie.types";
import {Movie} from "@/domains/movies/_models/movie/Movie.model";

/** Fetches a subset of movie fields used for populating UI input components. */
export async function fetchMoviesForInputs(
    {filters, sorts}: FetchLeanDataConfig<MovieSchemaFields> = {}
): Promise<MovieSchemaFields[]> {
    return Movie
        .find(filters ?? {})
        .sort(sorts)
        .select("_id name releaseDate isReleased slug")
        .lean();
}