/**
 * @fileoverview Data retrieval utility for aggregating theatre screens with scheduled showings for a target date.
 */

import {Types} from "mongoose";
import {buildShowingLookupStage} from "@/domains/showing/_feat/aggregation";
import {buildMovieLookupStage, MoviePopulationPipelines} from "@/domains/movies";
import {Screen} from "@/domains/screen/_models/screen";
import type {IANATimezone} from "@/shared/schema/date-time/IANATimezoneSchema";

type FetchConfig = {
    timezone: IANATimezone;
    localDateString: string;
    theatreID: Types.ObjectId;
    limit: number;
}

/** Aggregates screens for a specified theatre alongside their corresponding showings filtered by date and timezone. */
export async function fetchTheatreScreensWithShowings(
    {theatreID, timezone, localDateString, limit}: FetchConfig
) {
    const screenShowingsStage = buildShowingLookupStage({
        localField: "_id",
        foreignField: "screen",
        as: "showings",
        innerStages: [
            {
                $addFields: {
                    localDate: {
                        $dateToString: {
                            date: "$startTime",
                            timezone: timezone,
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {$match: {localDate: localDateString}},
            {$sort: {startTime: 1}},
            {$limit: limit},
            buildMovieLookupStage({as: "movie", innerStages: MoviePopulationPipelines}),
            {$unwind: "$movie"},
        ],
    });

    return Screen.aggregate([
        {$match: {theatre: theatreID}},
        {$sort: {name: 1}},
        {$limit: 50},
        screenShowingsStage,
    ]);
}