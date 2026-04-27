/** @fileoverview Service for fetching a subset of movie fields with minimal overhead. */

import type {FetchLeanDataConfig} from "@domains/ui-inputs/handlers/service.types";
import type {MovieSchemaFields} from "@domains/movie/model/Movie.types";
import MovieModel from "@domains/movie/model/Movie.model";

/** Retrieves a list of lean movie documents filtered and sorted by the provided configuration. */
export async function fetchLeanMovies(
    {filters, sorts}: FetchLeanDataConfig<MovieSchemaFields> = {}
): Promise<MovieSchemaFields[]> {
    return MovieModel
        .find(filters ?? {})
        .sort(sorts)
        .select("_id name releaseDate isReleased")
        .lean();
}