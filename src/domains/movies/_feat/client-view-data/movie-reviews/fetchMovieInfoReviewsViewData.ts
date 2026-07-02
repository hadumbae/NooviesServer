import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import {Movie, type MovieSchemaFields} from "@/domains/movies/_models";
import {MoviePopulationPaths} from "@/domains/movies/_feat/query-population";
import {
    fetchReviewDetailsForMovie,
    type ReviewDetailsByMovieReturns
} from "@/domains/movies/_feat/fetch-reviews-by-movie";

export type FetchMovieInfoReviewsViewDataConfig = {
    userID: Types.ObjectId;
    slug: SlugString;
    page: number;
    perPage: number;
}

export type MovieInfoReviewsViewData = {
    movie: MovieSchemaFields;
    reviewDetails: ReviewDetailsByMovieReturns;
};

export async function fetchMovieInfoReviewsViewData(
    {userID, slug, page, perPage}: FetchMovieInfoReviewsViewDataConfig
): Promise<MovieInfoReviewsViewData> {
    const movie = await Movie
        .findOne({slug})
        .populate(MoviePopulationPaths)
        .lean({virtuals: true});

    if (!movie) throw createHttpError(404, "Movie not found.");

    const reviewDetails = await fetchReviewDetailsForMovie({
        userID,
        movieID: movie._id,
        page,
        perPage,
        options: {populate: true, virtuals: true},
    });

    return {
        movie,
        reviewDetails,
    };
}