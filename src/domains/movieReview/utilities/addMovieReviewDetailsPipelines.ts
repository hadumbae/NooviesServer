/**
 * @file Aggregation pipeline stage for enriching movie review metadata.
 * @filename MovieReviewDetailsPipelines.ts
 */

import {type PipelineStage, Types} from "mongoose";

/**
 * Parameters for MovieReviewDetailsPipelines.
 */
type PipelineParams = {
    /** Current user identifier for personalization fields */
    userID: Types.ObjectId;
};

/**
 * Adds computed fields describing user interaction and engagement stats.
 */
export function addMovieReviewDetailsPipelines(
    {userID}: PipelineParams
): PipelineStage.AddFields {
    return {
        $addFields: {
            isLikedByUser: {
                $in: [userID, {$ifNull: ["$helpfulLikes", []]}]
            },
            isUserReview: {
                $eq: ["$user", userID]
            },
            helpfulCount: {
                $size: {$ifNull: ["$helpfulLikes", []]},
            },
        },
    };
}