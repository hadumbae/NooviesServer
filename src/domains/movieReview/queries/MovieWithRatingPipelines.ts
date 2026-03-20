/**
 * @file Aggregation pipelines for retrieving Movies with calculated rating metrics.
 * @filename MovieWithRatingPipelines.ts
 */

import type {PipelineStage} from "mongoose";
import {MoviePopulationPipelines} from "../../movie/queries/MoviePopulationPipelines.js";

/** * Union type restricted to the specific stages used in the rating calculation pipeline.
 */
type RatedMoviePipelines = PipelineStage.Lookup | PipelineStage.AddFields | PipelineStage.Unset;

/**
 * A sequence of Mongoose/MongoDB aggregation stages to enrich Movie documents with relational data
 * and calculated metrics.
 * @returns {RatedMoviePipelines[]} An array of aggregation stages for `Movie.aggregate()`.
 */
export const MovieWithRatingPipelines: RatedMoviePipelines[] = [
    ...MoviePopulationPipelines,
    {
        $lookup: {
            from: "moviereviews",
            let: {movieID: "$_id"},
            pipeline: [
                {
                    $match: {$expr: [{$eq: ["$movie", "$$movieID"]}]}
                },
                {
                    $project: {rating: 1, _id: 0}
                }
            ],
            as: "tempMR",
        },
    },
    {
        $addFields: {
            averageRating: {$ifNull: [{$avg: "$tempMR.rating"}, 0]}
        },
    },
    {
        $unset: "tempMR",
    },
];