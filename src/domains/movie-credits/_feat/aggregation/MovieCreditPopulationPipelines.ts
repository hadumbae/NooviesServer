/**
 * @fileoverview Defines MongoDB aggregation pipeline stages for populating movie credit relationships.
 */

import type {PopulationPipelineStages} from "@/shared/types/mongoose/AggregatePipelineStages.js";

/** Aggregation stages to populate movie, person, and roleType references in movie credit documents. */
export const MovieCreditPopulationPipelines: PopulationPipelineStages = [
    {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},
    {$lookup: {from: "people", localField: "person", foreignField: "_id", as: "person"}},
    {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
    {$unwind: {path: "$movie", preserveNullAndEmptyArrays: true}},
    {$unwind: {path: "$person", preserveNullAndEmptyArrays: true}},
    {$unwind: {path: "$roleType", preserveNullAndEmptyArrays: true}},
];