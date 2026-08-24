import {Theatre} from "@/domains/theatre/model/theatre/Theatre.model";
import createHttpError from "http-errors";
import {buildShowingLookupStage} from "@/domains/showing/_feat/aggregation/buildShowingLookupStage";
import {buildMovieLookupStage} from "@/domains/movies/_feat/aggregation/buildMovieLookupStage";
import {MoviePopulationPipelines} from "@/domains/movies/_feat/query-population/MoviePopulationPipelines";
import {Screen} from "@/domains/screen/_models/screen/Screen.model";
import type {TheatreSchemaFields} from "@/domains/theatre/model/theatre";
import type {ScreenWithShowings} from "@/domains/screen";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import type {SimpleDateString} from "@/shared/schema/date-time/SimpleDateStringSchema";

/** Configuration parameters for the request. */
export type FetchTheatreInfoViewDataConfig = {
    theatreSlug: SlugString;
    localDateString?: SimpleDateString;
    limit?: number;
};

/** Representation of the combined theatre and screen data. */
export type TheatreInfoViewData = {
    theatre: TheatreSchemaFields;
    screens: ScreenWithShowings[];
};

/**
 * Fetches theatre details and associated screens with showings for client browsing.
 */
export async function fetchTheatreInfoViewData(
    {theatreSlug, localDateString, limit = 3}: FetchTheatreInfoViewDataConfig
): Promise<TheatreInfoViewData> {
    const theatre = await Theatre.findOne({slug: theatreSlug}).lean({virtuals: true});
    if (!theatre) throw createHttpError(404, "Theatre not found!");

    console.log("Local Date String:", localDateString);


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
                            timezone: theatre.location.timezone,
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

    const screens = await Screen.aggregate([
        {$match: {theatre: theatre._id}},
        {$sort: {name: 1}},
        {$limit: 50},
        screenShowingsStage,
    ]);

    return {
        theatre,
        screens,
    };
}