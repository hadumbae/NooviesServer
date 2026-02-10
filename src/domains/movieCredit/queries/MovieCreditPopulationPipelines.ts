import type {PopulationPipelineStages} from "../../../shared/types/mongoose/AggregatePipelineStages.js";

export const MovieCreditPopulationPipelines: PopulationPipelineStages = [
    {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},
    {$lookup: {from: "people", localField: "person", foreignField: "_id", as: "person"}},
    {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
    {$unwind: {path: "$movie", preserveNullAndEmptyArrays: true}},
    {$unwind: {path: "$person", preserveNullAndEmptyArrays: true}},
    {$unwind: {path: "$roleType", preserveNullAndEmptyArrays: true}},
];