/**
 * @fileoverview Service for aggregating a person's filmography.
 */

import MovieCredit from "@domains/movieCredit/models/MovieCredit.model";
import type {
    FetchPersonFilmographyConfig,
    RoleCreditsGroup
} from "@domains/movieCredit/_feat/person-credits/service.types";

/**
 * Retrieves movie credits for a specific person, grouped by role and sorted by release date.
 */
export async function fetchPersonFilmography(
    { personID, limit = 10 }: FetchPersonFilmographyConfig
): Promise<RoleCreditsGroup[]> {
    return MovieCredit.aggregate<RoleCreditsGroup>([
        { $match: { person: personID } },

        { $lookup: { from: "movies", localField: "movie", foreignField: "_id", as: "movie" } },
        { $lookup: { from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType" } },

        { $unwind: "$movie" },
        { $unwind: "$roleType" },

        {
            $setWindowFields: {
                partitionBy: "$roleType._id",
                sortBy: { "movie.releaseDate": -1 },
                output: { index: { $rank: {} } },
            },
        },

        {
            $group: {
                _id: "$roleType.roleName",
                department: { $first: "$roleType.department" },
                totalCredits: { $sum: 1 },
                allCredits: { $push: "$$ROOT" }
            },
        },

        {
            $project: {
                _id: 0,
                role: "$_id",
                department: 1,
                totalCredits: 1,
                topCredits: { $slice: ["$allCredits", limit] },
                roleType: { $arrayElemAt: ["$allCredits.roleType", 0] }
            },
        },
    ]);
}