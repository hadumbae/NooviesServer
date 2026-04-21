/**
 * @fileoverview MongoDB Aggregation Pipeline for Theatre metrics.
 * Provides high-performance, calculated fields for inventory and scheduling
 * by traversing related collections at the database level.
 */

import type {PipelineStage} from "mongoose";

/**
 * Aggregation stages for calculating Theatre virtual counts.
 */
export const TheatreVirtualPipelines: PipelineStage[] = [
    {
        $lookup: {
            from: "screens",
            localField: "_id",
            foreignField: "theatre",
            as: "tempScreens",
            pipeline: [{$project: {_id: 1}}],
        },
    },
    {
        $lookup: {
            from: "seats",
            localField: "_id",
            foreignField: "theatre",
            as: "tempSeats",
            pipeline: [{$project: {_id: 1}}],
        },
    },
    {
        $lookup: {
            from: "showings",
            localField: "_id",
            foreignField: "theatre",
            as: "tempShowings",
            pipeline: [
                {
                    $match: {
                        status: {$in: ["SCHEDULED", "SOLD_OUT", "RUNNING"]},
                        startTime: {$gt: new Date()},
                    },
                },
                {$project: {_id: 1}}
            ],
        }
    },
    {
        $addFields: {
            screenCount: {$size: "$tempScreens"},
            seatCount: {$size: "$tempSeats"},
            futureShowingCount: {$size: "$tempShowings"},
        },
    },
    {
        $project: {
            tempScreens: 0,
            tempSeats: 0,
            tempShowings: 0,
        },
    }
];