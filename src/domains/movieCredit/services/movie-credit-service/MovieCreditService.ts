import MovieCredit from "../../models/MovieCredit.model.js";
import type {
    MovieCreditsByRole,
    FetchGroupedMovieCreditsByPersonParams,
    IMovieCreditService,
} from "./MovieCreditService.types.js";

/**
 * Service implementation for fetching and grouping movie credits by person and role.
 */
export default class MovieCreditService implements IMovieCreditService {
    /**
     * Fetches movie credits for a given person and groups them by role type.
     * Each role type includes up to 10 most recent credits, sorted by movie release date.
     *
     * @param params - Object containing the ID of the person whose credits are fetched.
     * @returns A Promise that resolves to an array of `MovieCreditsByRole`,
     *          each containing the role name and an array of corresponding movie credits.
     */
    async fetchGroupedMovieCreditsByPerson(params: FetchGroupedMovieCreditsByPersonParams): Promise<MovieCreditsByRole[]> {
        const {personID, limit = 10} = params;

        return MovieCredit.aggregate([
            // Filter credits by the given person
            {$match: {person: personID}},

            // Join with the "Movies" collection to populate the movie details
            {$lookup: {from: "Movies", localField: "movie", foreignField: "_id", as: "movie"}},
            {$unwind: "$movie"},

            // Join with the "RoleTypes" collection to populate the role type details
            {$lookup: {from: "RoleTypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
            {$unwind: "$roleType"},

            // Assign a rank to each credit within its role type, sorted by movie release date descending
            {
                $setWindowFields: {
                    partitionBy: "$roleType",
                    sortBy: {"movie.releaseDate": -1},
                    output: {index: {$rank: {}}},
                },
            },

            // Keep only the top 10 credits per role
            {$match: {index: {$lte: limit}}},

            // Group credits by role type
            {$group: {_id: "$roleType.roleName", credits: {$push: "$$ROOT"}}},

            // Project the final shape of the output
            {$project: {_id: 0, roleName: "$_id", credits: 1, roleType: {$arrayElemAt: ["$credits.roleType", 0]}}},
        ]);
    }
}
