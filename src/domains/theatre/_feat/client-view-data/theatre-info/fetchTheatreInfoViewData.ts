/**
 * @fileoverview Service function and types for aggregating theatre details, screen schedules, and upcoming movie showtimes.
 */

import createHttpError from "http-errors";
import {Theatre, type TheatreSchemaFields} from "@/domains/theatre/model/theatre";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import type {SimpleDateString} from "@/shared/schema/date-time/SimpleDateStringSchema";
import {type MovieSchemaFields} from "@/domains/movies/_models/movie";
import {type ScreenSchemaFields, type ScreenWithShowings} from "@/domains/screen/_models/screen";
import {fetchTheatreScreensWithShowings} from "@/domains/screen/_feat/fetch-theatre-screens/screens-with-showings";

import {
    Showing,
    ShowingSummarySelect,
    TheatreShowingPopulationPaths,
    type TheatreShowingSchema
} from "@/domains/showing";

/** Configuration parameters for the fetchTheatreInfoViewData request. */
export type FetchTheatreInfoViewDataConfig = {
    theatreSlug: SlugString;
    localDateString: SimpleDateString;
    limit?: number;
};

type TheatreScreenShowingGroup = {
    screen: ScreenSchemaFields;
    showings: TheatreShowingSchema[];
}

type TheatreMovieShowtimes = {
    movie: MovieSchemaFields;
    screens: TheatreScreenShowingGroup[];
}

/** Composite data structure containing information and schedule details for the theatre view. */
export type TheatreInfoViewData = {
    theatre: TheatreSchemaFields;
    screens: ScreenWithShowings[];
    upcoming: TheatreMovieShowtimes[];
};

/**
 * Fetches theatre details and associated screens with showings for client browsing.
 */
export async function fetchTheatreInfoViewData(
    {theatreSlug, localDateString, limit = 3}: FetchTheatreInfoViewDataConfig
): Promise<TheatreInfoViewData> {
    const theatre = await Theatre.findOne({slug: theatreSlug}).lean({virtuals: true});
    if (!theatre) throw createHttpError(404, "Theatre not found!");

    const screens = await fetchTheatreScreensWithShowings({
        theatreID: theatre._id,
        timezone: theatre.location.timezone,
        localDateString,
        limit,
    });

    const now = new Date();
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    const showings = await Showing
        .find({startTime: {$gt: now, $lte: endOfWeek}})
        .select(ShowingSummarySelect)
        .sort({startTime: 1})
        .populate<TheatreShowingSchema>(TheatreShowingPopulationPaths)
        .lean();

    const upcoming: TheatreMovieShowtimes[] = [];

    for (const showing of showings) {
        const movieGroup = upcoming.find((movieItem) => showing.movie._id.equals(movieItem.movie._id));

        if (!movieGroup) {
            const screenItem = {screen: showing.screen, showings: [showing]};
            upcoming.push({movie: showing.movie, screens: [screenItem]});
            continue;
        }

        const screenGroup = movieGroup.screens.find((screenItem) => showing.screen._id.equals(screenItem.screen._id));

        if (!screenGroup) {
            movieGroup.screens.push({screen: showing.screen, showings: [showing]});
            movieGroup.screens.sort((a, b) => a.screen.name.localeCompare(b.screen.name));
            continue;
        }

        screenGroup.showings.push(showing);
        // No sorting for showings.
        // Ensure query includes sorting by `startTime`.
    }

    return {
        theatre,
        screens,
        upcoming,
    };
}