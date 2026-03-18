/**
 * @file Service for fetching paginated showings for a movie.
 * @filename ShowingsForMovieService.ts
 */

import Showing from "../../models/showing/Showing.model.js";
import type {FetchShowingsForMovieParams, FetchShowingsForMovieReturns} from "./ShowingsForMovieService.types.js";
import type {FilterQuery} from "mongoose";
import type {ShowingSchemaFields} from "../../models/showing/Showing.types.js";
import {generateFuzzyRegexPattern} from "../../../../shared/utility/regex/generateFuzzyRegexPattern.js";
import {ShowingPopulationPipelines} from "../../queries/ShowingPopulationPipelines.js";

/**
 * Returns paginated, active scheduled showings for a given movie.
 *
 * Applies:
 * - Country filter (required)
 * - Optional fuzzy location matching (`city`, `state`, `postalCode`)
 * - Aggregation-based pagination with total count
 */
export const fetchShowingsForMovie = async (
    {movieID, queries: {page, perPage, country, near}}: FetchShowingsForMovieParams
): Promise<FetchShowingsForMovieReturns> => {
    const matchStage: FilterQuery<ShowingSchemaFields> = {
        movie: movieID,
        status: "SCHEDULED",
        "config.isActive": true,
        "location.country": country,
    };

    if (near) {
        const locSearchRegex = {
            $regex: generateFuzzyRegexPattern(near),
            $options: "i",
        };

        matchStage.$or = [
            {"location.city": locSearchRegex},
            {"location.state": locSearchRegex},
            {"location.postalCode": locSearchRegex},
        ];
    }

    const [result] = await Showing.aggregate<FetchShowingsForMovieReturns>([
        {
            $match: matchStage
        },
        {
            $facet: {
                totalCount: [
                    {$count: "count"}
                ],
                items: [
                    {$skip: perPage * (page - 1)},
                    {$limit: perPage},
                    {$sort: {startTime: -1}},
                    ...ShowingPopulationPipelines,
                ],
            }
        },
        {
            $project: {
                items: 1,
                totalItems: {
                    $ifNull: [
                        {$arrayElemAt: ["$totalCount.count", 0]},
                        0
                    ],
                },
            }
        },
    ]);

    return result;
}