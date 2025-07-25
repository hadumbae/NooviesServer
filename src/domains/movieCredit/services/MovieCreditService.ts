import type {FilterQuery} from "mongoose";
import type {MovieCreditMatchQueryParams} from "../schemas/query/MovieCreditMatchQueryParamsSchema.js";
import type {PopulatePipelineStages} from "../../../shared/types/mongoose/PopulatePipelineStages.js";
import type {IMovieCredit} from "../models/IMovieCredit.js";
import MovieCredit from "../models/MovieCredit.js";

type FetchCountParams = {
    matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
    populateFilters: PopulatePipelineStages
};

type FetchAllParams = {
    matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
    populateFilters: PopulatePipelineStages,
    limit?: number,
    populate?: boolean,
};

type FetchPaginationParams = {
    page: number,
    perPage: number,
    matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
    populateFilters: PopulatePipelineStages,
    populate?: boolean,
};

interface IMovieCreditService {
    count(params: FetchCountParams): Promise<number>;
    all(params: FetchAllParams): Promise<IMovieCredit[]>;
    paginate(params: FetchPaginationParams): Promise<IMovieCredit[]>;
    populatePipelines(): PopulatePipelineStages;
}

export default class MovieCreditService implements IMovieCreditService {
    async count({matchFilters, populateFilters}: FetchCountParams): Promise<number> {
        const aggregate = await MovieCredit.aggregate([
            {$match: matchFilters},
            ...populateFilters,
            {$count: "docCount"},
        ]);

        return aggregate[0]?.docCount ?? 0;
    }

    async all(params: FetchAllParams): Promise<IMovieCredit[]> {
        const {matchFilters, populateFilters, limit, populate = false} = params;

        const populatePipelines = populate ? this.populatePipelines() : [];
        const limitPipeline = limit !== undefined ? [{$limit: limit!}] : [];

        return MovieCredit.aggregate([
            {$match: matchFilters},
            ...populateFilters,
            ...populatePipelines,
            {$sort: {billingOrder: 1}},
            ...limitPipeline,
        ]);
    }

    async paginate(params: FetchPaginationParams): Promise<IMovieCredit[]>{
        const {page, perPage, matchFilters, populateFilters, populate = false} = params;
        const populatePipelines = populate ? this.populatePipelines() : [];

        return MovieCredit.aggregate([
            {$match: matchFilters},
            ...populateFilters,
            {$skip: (page - 1) * perPage},
            {$limit: perPage},
            ...populatePipelines,
            {$sort: {billingOrder: 1}},
        ]);
    }

    populatePipelines(): PopulatePipelineStages {
        return [
            {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},
            {$lookup: {from: "people", localField: "person", foreignField: "_id", as: "person"}},
            {$unwind: {path: "$movie", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$person", preserveNullAndEmptyArrays: true}},
        ];
    }
}