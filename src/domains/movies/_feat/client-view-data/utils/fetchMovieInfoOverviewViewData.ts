/**
 * @fileoverview Utility for fetching composite movie data for the overview view.
 */

import createHttpError from "http-errors";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import {Types} from "mongoose";
import type {PositiveInteger} from "@/shared/schema/numbers/PositiveIntegerSchema";
import {Movie, type MovieSchemaFields} from "@/domains/movies/_models/movie";
import type {IMovieCredit} from "@/domains/movieCredit/models/MovieCredit.interface";
import {
    fetchReviewDetailsForMovie,
    type ReviewDetailsByMovieReturns
} from "@/domains/movies/_feat/fetch-reviews-by-movie";
import {MoviePopulationPaths} from "@/domains/movies/_feat/query-population";
import MovieCredit from "@/domains/movieCredit/models/MovieCredit.model";
import {MovieCreditPopulationPaths} from "@/domains/movieCredit/_feat/query-population";

/** Configuration parameters for fetching movie information view data. */
export type FetchMovieInfoOverviewViewDataConfig = {
    slug: SlugString;
    userID: Types.ObjectId;
    reviewPage: PositiveInteger;
    reviewPerPage: PositiveInteger;
}

/** The composite data structure returned for the movie information view. */
export type MovieInfoOverviewViewData = {
    movie: MovieSchemaFields;
    credits: IMovieCredit[];
    reviewDetails: ReviewDetailsByMovieReturns;
}

/** Fetches composite data for the movie information view including details, credits, and reviews. */
export async function fetchMovieInfoOverviewViewData(
    {userID, slug, reviewPage, reviewPerPage}: FetchMovieInfoOverviewViewDataConfig
): Promise<MovieInfoOverviewViewData> {
    const movie = await Movie
        .findOne({slug})
        .populate(MoviePopulationPaths)
        .lean({virtuals: true});

    if (!movie) throw createHttpError(404, "Movie not found.");

    const credits = await MovieCredit
        .find({movie: movie._id})
        .populate(MovieCreditPopulationPaths)
        .lean({virtuals: true});

    const reviewDetails = await fetchReviewDetailsForMovie({
        userID,
        movieID: movie._id,
        page: reviewPage,
        perPage: reviewPerPage,
        options: {populate: true, virtuals: true},
    });

    return {
        movie,
        credits,
        reviewDetails,
    };
}
