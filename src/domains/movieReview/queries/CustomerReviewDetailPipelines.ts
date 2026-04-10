/**
 * @file MongoDB Aggregation pipeline stages for hydrating a detailed customer movie review.
 * @filename CustomerReviewDetailPipelines.ts
 */

import type {PipelineStage} from "mongoose";
import {MovieWithRatingPipelines} from "@domains/movieReview/queries/MovieWithRatingPipelines";

/**
 * A reusable sequence of aggregation stages designed to transform a raw review document
 * into a feature-rich data structure for administrative or client detail views.
 * ---
 */
export const CustomerReviewDetailPipelines: PipelineStage[] = [
    {
        $lookup: {
            from: "movies",
            localField: "movie",
            foreignField: "_id",
            as: "movie",
            pipeline: MovieWithRatingPipelines,
        },
    },
    {
        $unwind: "$movie"
    },
    {
        $addFields: {
            helpfulCount: {$size: "$helpfulLikes"}
        }
    },
    {
        $project: {
            helpfulLikes: 0
        }
    },
];