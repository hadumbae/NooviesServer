import type {FilterQuery, SortOrder} from "mongoose";
import type {MovieQueryMatchFilters} from "../../schema/query/MovieQueryOption.types.js";
import type {MovieSchemaFields} from "../../model/Movie.types.js";

/**
 * Parameters for fetching paginated movies that include recent active showings.
 */
export interface FetchPaginatedMoviesWithRecentShowingsParams {
    /**
     * The current page number (1-based).
     */
    page: number;

    /**
     * The number of movies to return per page.
     */
    perPage: number;

    /**
     * Optional MongoDB filter query to further restrict movies.
     *
     * Example: `{ genre: "Action" }`
     */
    query?: FilterQuery<MovieQueryMatchFilters>;

    /**
     * Optional sort definition for movies.
     *
     * Keys correspond to properties of {@link MovieSchemaFields}, values are Mongoose sort orders (`1` for ascending, `-1` for descending).
     *
     * Example: `{ releaseDate: -1 }`
     */
    sort?: Partial<Record<keyof MovieSchemaFields, SortOrder>>;
}

/**
 * Return shape for paginated movie queries with active showings.
 */
export interface FetchPaginatedMoviesWithRecentShowingsReturns {
    /**
     * The list of movies matching the query and pagination.
     */
    items: MovieSchemaFields[];

    /**
     * The total number of movies that match the filter (ignores pagination).
     */
    totalItems: number;
}

/**
 * Defines the contract for movie services.
 *
 * Provides methods for fetching and working with movies and their active showings.
 */
export default interface IMovieService {
    /**
     * Fetches a paginated list of movies that have at least one active showing.
     *
     * @param params - Pagination, filtering, and sorting options.
     * @returns A promise that resolves to the paginated movies and total count.
     *
     * @example
     * ```ts
     * const service: IMovieService = new MovieService();
     * const result = await service.fetchPaginatedMoviesWithRecentShowings({
     *   page: 1,
     *   perPage: 10,
     *   query: { genre: "Drama" },
     *   sort: { title: 1 }
     * });
     *
     * console.log(result.items); // paginated movies
     * console.log(result.totalItems); // total count of matches
     * ```
     */
    fetchPaginatedMoviesWithRecentShowings(
        params: FetchPaginatedMoviesWithRecentShowingsParams
    ): Promise<FetchPaginatedMoviesWithRecentShowingsReturns>;
}