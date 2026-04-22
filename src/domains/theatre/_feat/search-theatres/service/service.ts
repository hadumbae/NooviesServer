/**
 * @fileoverview Service for location-based theatre searches with scheduled movie showings.
 */

import type {PipelineStage} from "mongoose";
import {ShowingPopulationPipelines} from "@domains/showing/queries/ShowingPopulationPipelines";
import {ShowingSeatMapVirtualPipelines} from "@domains/showing/queries/ShowingSeatMapVirtualPipelines";
import {Theatre} from "@domains/theatre/model/theatre";
import {buildTheatreLocationMatchStage} from "@domains/theatre/_feat/aggregate";
import type {FetchTheatreByLocationConfig, TheatreByLocationReturns} from "@domains/theatre/_feat/search-theatres";

/**
 * Aggregates theatres matching a location target, including their upcoming scheduled showings and seat maps.
 */
export async function fetchTheatresByLocation(
    {target, page = 1, perPage = 20, limit: showingLimit}: FetchTheatreByLocationConfig,
): Promise<TheatreByLocationReturns> {
    const limitedPerPage = Math.min(perPage, 20);

    const pipelines: PipelineStage[] = [
        ...(target ? [buildTheatreLocationMatchStage(target)] : []),
        {
            $lookup: {
                from: "showings",
                localField: "_id",
                foreignField: "theatre",
                as: "showings",
                pipeline: [
                    {$match: {status: "SCHEDULED"}},
                    {$sort: {startTime: -1}},
                    ...ShowingPopulationPipelines,
                    ...ShowingSeatMapVirtualPipelines,
                    ...(showingLimit ? [{$limit: Math.min(showingLimit, 10)}] : []),
                ],
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