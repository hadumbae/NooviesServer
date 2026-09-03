import {Theatre, type TheatreWithShowings} from "@/domains/theatre/model/theatre";
import type {LookupPipelineStages} from "@/shared/_types";
import {ShowingPopulationPipelines, ShowingSeatMapVirtualPipelines} from "@/domains/showing";
import type {PipelineStage} from "mongoose";
import {buildTheatreLocationMatchStage} from "@/domains/theatre/_feat/aggregate";
import type {ISO3166Alpha2CountryCode} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import type {LocationTarget} from "@/shared/schema/features/location-query-options/LocationQueryOptions.types";

/** Props for the fetchTheatresByLocation service function. */
export type FetchTheatreByLocationConfig = {
    target?: LocationTarget;
    country?: ISO3166Alpha2CountryCode;
    page: number;
    perPage: number;
    limit?: number;
};

/** Paginated result set containing theatres with their associated movie showings. */
export type TheatreByLocationReturns = {
    items: TheatreWithShowings[];
    totalItems: number;
};

/**
 * Aggregates theatres matching a location target, including their upcoming scheduled showings and seat maps.
 */
export async function fetchTheatresByLocation(
    {target, country, page = 1, perPage = 20, limit: showingLimit}: FetchTheatreByLocationConfig,
): Promise<TheatreByLocationReturns> {
    const limitedPerPage = Math.min(perPage, 20);

    const showingPipelines: LookupPipelineStages = [
        {$match: {status: "SCHEDULED", startTime: {$gte: new Date()}}},
        {$sort: {startTime: 1}},
        ...ShowingPopulationPipelines,
        ...ShowingSeatMapVirtualPipelines,
        ...(showingLimit ? [{$limit: Math.min(showingLimit, 10)}] : []),
    ];

    const pipelines: PipelineStage[] = [
        ...(
            target || country
                ? [buildTheatreLocationMatchStage({target, country})]
                : []
        ),
        {
            $lookup: {
                from: "showings",
                localField: "_id",
                foreignField: "theatre",
                as: "showings",
                pipeline: showingPipelines,
            },
        },
        {
            $match: {"showings.0": {$exists: true}},
        },
        {
            $facet: {
                totalData: [{$count: "count"}],
                items: [
                    {$sort: {name: 1}},
                    {$skip: (page - 1) * limitedPerPage},
                    {$limit: limitedPerPage},
                ],
            },
        },
        {
            $project: {
                items: 1,
                totalItems: {
                    $ifNull: [{$arrayElemAt: ["$totalData.count", 0]}, 0]
                },
            },
        },
    ];

    const [result] = await Theatre.aggregate(pipelines);

    return result;
}