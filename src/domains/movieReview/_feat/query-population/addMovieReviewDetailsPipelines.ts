/**
 * @fileoverview Aggregation pipeline stage for enriching movie review metadata.
 */

import {type PipelineStage, Types} from "mongoose";

/** Parameters for the movie review details pipeline generator. */
type PipelineParams = {
    userID: Types.ObjectId;
};

/**
 * Generates an aggregation stage to add user interaction and engagement statistics to movie reviews.
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