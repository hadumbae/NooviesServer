/**
 * @fileoverview Service for fetching client-facing theatre browsing information.
 */


import type {FetchTheatreInfoViewDataConfig, TheatreInfoViewData} from "@domains/theatre/_feat/client-view-data";
import {Theatre} from "@domains/theatre/model/theatre";
import createHttpError from "http-errors";
import {buildShowingLookupStage} from "@domains/showing/_feat/aggregation";
import {buildMovieLookupStage} from "@domains/movie/_feat/aggregation";
import {Screen} from "@domains/screen/models/screen";

/**
 * Fetches theatre details and associated screens with showings for client browsing.
 */
export async function fetchTheatreInfoViewData(
    {theatreSlug, localDateString, limit = 3}: FetchTheatreInfoViewDataConfig
): Promise<TheatreInfoViewData> {
    const theatre = await Theatre.findOne({slug: theatreSlug}).lean({virtuals: true});
    if (!theatre) throw createHttpError(404, "Theatre not found!");

    const screenShowingsStage = buildShowingLookupStage({
        as: "showings",
        innerStages: [
            {
                $addFields: {
                    localDate: {
                        $dateToString: {
                            date: "$startTime",
                            timezone: theatre.location.timezone,
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {$match: {localDate: localDateString}},
            {$sort: {startTime: 1}},
            {$limit: limit},
            buildMovieLookupStage({as: "movie"}),
            {$unwind: "$movie"},
        ],
    });

    const screens = await Screen.aggregate([
        {$match: {theatre: theatre._id}},
        {$sort: {name: 1}},
        screenShowingsStage,
    ]);

    return {
        theatre,
        screens,
    };
}