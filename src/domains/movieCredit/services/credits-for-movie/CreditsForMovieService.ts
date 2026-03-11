/**
 * @file Aggregates and groups movie credits for cast and crew views.
 * @filename CreditsForMovieService.ts
 */

import {Types} from "mongoose";
import MovieCredit from "../../models/MovieCredit.model.js";
import type {GroupedCreditsForMovieData} from "./CreditsForMovieService.types.js";

/**
 * Fetches and groups credits for a movie into cast and crew collections.
 */
export const fetchCreditsForMovie = async (
    movieID: Types.ObjectId
): Promise<GroupedCreditsForMovieData> => {
    const [data] = await MovieCredit.aggregate<GroupedCreditsForMovieData>([
        {$match: {movie: movieID}},
        {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
        {$lookup: {from: "people", localField: "person", foreignField: "_id", as: "person"}},
        {$unwind: "$roleType"},
        {$unwind: "$person"},
        {
            $facet: {
                castCredits: [
                    {$match: {department: "CAST"}},
                    {$sort: {billingOrder: 1, isPrimary: 1, characterName: 1}},
                ],
                crewCredits: [
                    {$match: {department: "CREW"}},
                    {
                        $group: {
                            _id: "$roleType.category",
                            category: {$first: "$roleType.category"},
                            credits: {$push: "$$ROOT"},
                            totalCredits: {$sum: 1},
                        },
                    },
                    {$project: {_id: 0, category: 1, credits: 1, totalCredits: 1}},
                ]
            },
        },
    ]);

    return data;
}