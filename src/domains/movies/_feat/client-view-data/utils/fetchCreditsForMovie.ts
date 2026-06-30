/**
 * @fileoverview Utility for fetching and grouping movie credits by department and category.
 */

import {Types} from "mongoose";
import type {IMovieCredit} from "@/domains/movieCredit/models/MovieCredit.interface";
import MovieCredit from "@/domains/movieCredit/models/MovieCredit.model";
import type {RoleTypeCastCategory, RoleTypeCrewCategory} from "@/domains/role-types/_validation/schema/RoleTypeCategorySchema";

/** Credits grouped by their specific role type category. */
export type CategoryGroupedCredits = {
    category: RoleTypeCastCategory | RoleTypeCrewCategory;
    credits: IMovieCredit[];
    totalCredits: number;
}

/** The complete set of cast and crew credits for a movie view. */
export type GroupedCreditsForMovieData = {
    castCredits: IMovieCredit[];
    crewCredits: CategoryGroupedCredits[];
}

/** Aggregates movie credits into cast lists and categorized crew groups. */
export async function fetchCreditsForMovie(
    movieID: Types.ObjectId
): Promise<GroupedCreditsForMovieData> {
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