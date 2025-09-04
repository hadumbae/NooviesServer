import type IMovieService from "./IMovieService.js";
import type {FetchPaginatedMoviesWithRecentShowingsReturns} from "./IMovieService.js";
import type {FetchPaginatedMoviesWithRecentShowingsParams} from "./IMovieService.js";
import MovieModel from "../../model/Movie.model.js";
import type {PipelineStage} from "mongoose";

/**
 * Service implementation for working with movies.
 *
 * Provides methods for fetching movies along with their recent active showings.
 */
export default class MovieService implements IMovieService {
    /**
     * Fetches a paginated list of movies that have at least one active showing.
     *
     * Uses MongoDB aggregation with `$lookup`, `$match`, `$facet`, and `$project`
     * stages to join movies with their recent showings, filter based on active
     * showings, paginate results, and return both the items and total count.
     *
     * @param params - Pagination and filtering options
     * @param params.page - The current page number (1-based)
     * @param params.perPage - Number of movies per page
     * @param params.query - Optional MongoDB match query to filter movies
     *
     * @returns An object containing:
     * - `items`: The list of movies (with active showings)
     * - `totalItems`: The total count of matching movies
     *
     * @example
     * ```ts
     * const service = new MovieService();
     * const results = await service.fetchPaginatedMoviesWithRecentShowings({
     *   page: 1,
     *   perPage: 10,
     *   query: { genre: "Action" }
     * });
     * console.log(results.items); // movies with active showings
     * console.log(results.totalItems); // total count
     * ```
     */
    async fetchPaginatedMoviesWithRecentShowings(
        params: FetchPaginatedMoviesWithRecentShowingsParams
    ): Promise<FetchPaginatedMoviesWithRecentShowingsReturns> {
        const { page, perPage, query } = params;

        const lookupStage: PipelineStage.Lookup = {
            $lookup: {
                from: "Showing",
                let: { $movieId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$movie", "$$movieId"] },
                                    { $eq: ["$isActive", true] }
                                ]
                            }
                        }
                    },
                    { $sort: { startTime: 1 } },
                    { $limit: 10 },
                ],
                as: "activeShowings"
            }
        };

        const matchStage: PipelineStage.Match = {
            $match: {
                ...(query ?? {}),
                "activeShowings.0": { $exists: true }
            },
        };

        const facetStage: PipelineStage.Facet = {
            $facet: {
                totalCount: [{ $count: "totalItems" }],
                items: [
                    { $skip: perPage * (page - 1) },
                    { $limit: perPage }
                ],
            }
        };

        const projectStage: PipelineStage.Project = {
            $project: {
                items: 1,
                totalItems: { $arrayElemAt: ["$totalCount.totalItems", 0] }
            }
        };

        const aggregatedData = await MovieModel.aggregate([
            lookupStage,
            matchStage,
            facetStage,
            projectStage
        ]);

        return aggregatedData[0] || { items: [], totalItems: 0 };
    }
}