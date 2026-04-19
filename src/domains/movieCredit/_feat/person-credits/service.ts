/**
 * @fileoverview Service for aggregating a person's filmography.
 */

import MovieCredit from "@domains/movieCredit/models/MovieCredit.model";
import type {
    FetchPersonCreditStatsConfig,
    FetchPersonFilmographyConfig, PersonCreditStats,
    RoleCreditsGroup
} from "@domains/movieCredit/_feat/person-credits/service.types";

/**
 * Calculates aggregated statistics for a person's involvement in movies.
 */
export async function fetchPersonCreditStats(
    {personID}: FetchPersonCreditStatsConfig
): Promise<PersonCreditStats> {
    const [data] = await MovieCredit.aggregate<PersonCreditStats>([
        {$match: {person: personID}},
        {
            $group: {
                _id: "$person._id",
                totalCredits: {$sum: 1},
                uniqueMovies: {$addToSet: "$movie"},
            },
        },
        {
            $project: {
                _id: 0,
                creditCount: "$totalCredits",
                movieCount: {$size: "$uniqueMovies"},
            },
        },
    ]);

    return data ?? { creditCount: 0, movieCount: 0 };
}

/**
 * Retrieves movie credits for a specific person, grouped by role and sorted by release date.
 */
export async function fetchPersonFilmography(
    {personID, limit = 10}: FetchPersonFilmographyConfig
): Promise<RoleCreditsGroup[]> {
    return MovieCredit.aggregate<RoleCreditsGroup>([
        {$match: {person: personID}},

        {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},
        {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},

        {$unwind: "$movie"},
        {$unwind: "$roleType"},

        {
            $setWindowFields: {
                partitionBy: "$roleType._id",
                sortBy: {"movie.releaseDate": -1},
                output: {index: {$rank: {}}},
            },
        },

        {
            $group: {
                _id: "$roleType.roleName",
                department: {$first: "$roleType.department"},
                totalCredits: {$sum: 1},
                allCredits: {$push: "$$ROOT"}
            },
        },

        {
            $project: {
                _id: 0,
                role: "$_id",
                department: 1,
                totalCredits: 1,
                topCredits: {$slice: ["$allCredits", limit]},
                roleType: {$arrayElemAt: ["$allCredits.roleType", 0]}
            },
        },
    ]);
}