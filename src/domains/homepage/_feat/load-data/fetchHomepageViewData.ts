/**
 * @fileoverview Data aggregation function for fetching composite homepage metrics and domain summaries.
 */

import type {HomepageViewDataRouteConfig} from "@/domains/homepage/_feat/load-data/HomepageViewDataRouteConfigSchema";
import {Types} from "mongoose";
import {Movie, type MovieSchemaFields, MovieSummarySelect} from "@/domains/movies";
import {Genre, type GenreSchemaFields, GenreSummarySelect} from "@/domains/genres";
import {Theatre, type TheatreSchemaFields} from "@/domains/theatre/model/theatre";
import {Showing, type ShowingSchemaFields, ShowingSummarySelect} from "@/domains/showing";
import {Reservation, type ReservationSchemaFields} from "@/domains/reservations";
import {ReservationSummarySelect} from "@/domains/reservations/_feat/query-population/ReservationSummarySelect";

/** Configuration options for fetching user-specific and general homepage view data. */
type FetchConfig = HomepageViewDataRouteConfig & {
    user?: Types.ObjectId;
}

/** Aggregated domain summary collections returned for the homepage view. */
type FetchReturns = {
    movies: MovieSchemaFields[];
    genres: GenreSchemaFields[];
    theatres: TheatreSchemaFields[];
    showings: ShowingSchemaFields[];
    reservations: ReservationSchemaFields[];
}

/** Queries and aggregates movies, genres, theatres, showings, and user reservations for the homepage view. */
export async function fetchHomepageViewData(
    {user, country, recentCount, movieCount, genreCount, theatreCount, upcomingCount, reservationCount}: FetchConfig
): Promise<FetchReturns> {
    const now = new Date();

    const movies = await Movie
        .find({isReleased: true, releaseDate: {$lte: now}})
        .select(MovieSummarySelect)
        .sort({releaseDate: -1})
        .limit(recentCount)
        .lean();

    const genreStubs = await Genre
        .find({isFeatured: true})
        .select(GenreSummarySelect)
        .limit(genreCount)
        .lean();

    const genres = await Promise.all(genreStubs.map(async (genre) => ({
        ...genre, movies: await Movie
            .find({isReleased: true, releaseDate: {$lte: now}, genres: genre._id})
            .sort({releaseDate: -1})
            .select(MovieSummarySelect)
            .limit(movieCount)
            .lean(),
    })));

    const sampled = await Theatre.aggregate([
        {$match: {"location.country": country}},
        {$sample: {size: theatreCount}},
        {$project: {_id: 1}},
    ]);

    const theatreIDs = sampled.map((doc) => doc._id);
    const theatres = await Theatre.find({_id: {$in: theatreIDs}}).lean({virtuals: true});

    const showings = await Showing
        .find({"theatreSnapshot.country": country, startTime: {$gte: now}, status: {$in: ["SCHEDULED", "SOLD_OUT"]}})
        .select(ShowingSummarySelect)
        .sort({startTime: 1})
        .limit(upcomingCount)
        .lean();

    const generalData = {
        movies,
        genres,
        theatres,
        showings,
    };

    if (!user) return {...generalData, reservations: [],}

    const reservations = await Reservation
        .find({user, "snapshot.startTime": {$gt: now}, status: {$in: ["RESERVED", "PAID"]}})
        .select(ReservationSummarySelect)
        .sort({"snapshot.startTime": 1})
        .limit(reservationCount)
        .lean();

    return {
        ...generalData,
        reservations,
    }
}