/**
 * @fileoverview Utility for building a MongoDB $lookup pipeline stage for showings.
 */

import type {PipelineStage} from "mongoose";
import type {LookupStageConfig} from "@shared/_feat/aggregation";

/**
 * Builds a MongoDB $lookup stage for the showings collection.
 */
export function buildShowingLookupStage(
    {innerStages, localField = "showing", foreignField = "_id", as = "showing"}: LookupStageConfig = {}
): PipelineStage.Lookup {
    return (
        {
            $lookup: {
                from: "showings",
                localField,
                foreignField,
                as,
                pipeline: innerStages
            }
        }
    );
}