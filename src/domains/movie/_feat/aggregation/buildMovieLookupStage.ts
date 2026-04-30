/**
 * @fileoverview Utility for building a MongoDB $lookup pipeline stage for movies.
 */

import type {PipelineStage} from "mongoose";
import type {LookupStageConfig} from "@shared/_feat/aggregation";

/**
 * Builds a MongoDB $lookup stage for the movies collection.
 */
export function buildMovieLookupStage(
    {innerStages, localField = "movie", foreignField = "_id", as = "movie"}: LookupStageConfig = {}
): PipelineStage.Lookup {
    return (
        {
            $lookup: {
                from: "movies",
                localField,
                foreignField,
                as,
                pipeline: innerStages
            }
        }
    );
}