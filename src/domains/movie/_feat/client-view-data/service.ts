/**
 * @fileoverview Service for fetching movie-related data including credits and scheduled showings.
 */

import {type FilterQuery, Types} from "mongoose";
import MovieCredit from "@domains/movieCredit/models/MovieCredit.model";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import {generateFuzzyRegexPattern} from "@shared/utility/regex/generateFuzzyRegexPattern";
import Showing from "@domains/showing/models/showing/Showing.model";
import {ShowingPopulationPipelines} from "@domains/showing/queries/ShowingPopulationPipelines";
import type {
    FetchMovieInfoViewDataConfig,
    FetchShowingsForMovieParams,
    FetchShowingsForMovieReturns,
    GroupedCreditsForMovieData,
    MovieInfoViewData
} from "@domains/movie/_feat/client-view-data/service.types";
import {Movie} from "@domains/movie/model/movie";
import {MoviePopulationPaths} from "@domains/movie/_feat/query-population";
import createHttpError from "http-errors";
import {MovieCreditPopulationPaths} from "@domains/movieCredit/_feat/query-population";
import {fetchReviewDetailsForMovie} from "@domains/movie/_feat/fetch-reviews-by-movie";

/** Aggregates and groups cast and crew credits for a specific movie. */
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

/** Retrieves a paginated list of active scheduled showings for a movie, filtered by location. */
export async function fetchShowingsForMovie(
    {movieID, queries: {page, perPage, country, near}}: FetchShowingsForMovieParams
): Promise<FetchShowingsForMovieReturns> {
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

/** Fetches composite data for the movie information view including details, credits, and reviews. */
export async function fetchMovieInfoViewData(
    {userID, slug, reviewPage, reviewPerPage}: FetchMovieInfoViewDataConfig
): Promise<MovieInfoViewData> {
    const movie = await Movie
        .findOne({slug})
        .populate(MoviePopulationPaths)
        .lean({virtuals: true});

    if (!movie) throw createHttpError(404, "Movie not found.");

    const credits = await MovieCredit
        .find({movie: movie._id})
        .populate(MovieCreditPopulationPaths)
        .lean({virtuals: true});

    const reviews = await fetchReviewDetailsForMovie({
        userID,
        movieID: movie._id,
        page: reviewPage,
        perPage: reviewPerPage,
        options: {populate: true, virtuals: true},
    });

    return {
        movie,
        credits,
        reviews,
    };
}
