/**
 * @fileoverview MongoDB aggregation pipelines for populating SeatMap reference data.
 */

import { ShowingPopulationPipelines } from "@/domains/showing/_feat/query-population/ShowingPopulationPipelines";
import { SeatPopulationPipelines } from "@/domains/seat/_feat/aggregate";
import type {PopulationPipelineStages} from "@/shared/_types";

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