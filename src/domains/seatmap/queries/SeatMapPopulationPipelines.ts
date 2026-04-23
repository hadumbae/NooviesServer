/**
 * @fileoverview MongoDB aggregation pipelines for populating SeatMap reference data.
 */

import type { PopulationPipelineStages } from "@shared/types/mongoose/AggregatePipelineStages";
import { ShowingPopulationPipelines } from "../../showing/queries/ShowingPopulationPipelines.js";
import { SeatPopulationPipelines } from "@domains/seat/_feat/aggregate";

/**
 * Aggregation stages that resolve showing and seat references for SeatMap documents.
 */
export const SeatMapPopulationPipelines: PopulationPipelineStages = [
    {
        $lookup: {
            from: "showings",
            localField: "showing",
            foreignField: "_id",
            as: "showing",
            pipeline: ShowingPopulationPipelines,
        },
    },
    {
        $lookup: {
            from: "seats",
            localField: "seat",
            foreignField: "_id",
            as: "seat",
            pipeline: SeatPopulationPipelines,
        },
    },
    {
        $unwind: "$showing",
    },
    {
        $unwind: "$seat",
    },
];