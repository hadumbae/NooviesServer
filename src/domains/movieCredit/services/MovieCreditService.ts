import type {FilterQuery} from "mongoose";
import type {MovieCreditMatchQueryParams} from "../schemas/query/MovieCreditMatchQueryParamsSchema.js";
import type {PopulatePipelineStages} from "../../../shared/types/mongoose/PopulatePipelineStages.js";
import type {IMovieCredit} from "../models/IMovieCredit.js";
import MovieCredit from "../models/MovieCredit.js";

interface IMovieCreditService {
    count(params: {
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
        pipelineFilters: PopulatePipelineStages
    }): Promise<number>;

    all(params: {
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
        pipelineFilters: PopulatePipelineStages,
        populate?: boolean,
    }): Promise<IMovieCredit[]>;

    paginate(params: {
        page: number,
        perPage: number,
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
        pipelineFilters: PopulatePipelineStages,
        populate?: boolean,
    }): Promise<IMovieCredit[]>;

    populatePipelines(): PopulatePipelineStages;
}

export default class MovieCreditService implements IMovieCreditService {
    async count({matchFilters, pipelineFilters}: {
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>;
        pipelineFilters: PopulatePipelineStages
    }): Promise<number> {
        const aggregate = await MovieCredit.aggregate([
            {$match: matchFilters},
            ...pipelineFilters,
            {$count: "docCount"},
        ]);

        return aggregate[0]?.docCount ?? 0;
    }

    async all({matchFilters, pipelineFilters, populate = false}: {
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
        pipelineFilters: PopulatePipelineStages,
        populate?: boolean,
    }): Promise<IMovieCredit[]> {
        const populatePipelines = populate ? this.populatePipelines() : [];

        return MovieCredit.aggregate([
            {$match: matchFilters},
            ...pipelineFilters,
            ...populatePipelines,
        ]);
    }

    async paginate(params: {
        page: number,
        perPage: number,
        matchFilters: FilterQuery<MovieCreditMatchQueryParams>,
        pipelineFilters: PopulatePipelineStages,
        populate?: boolean,
    }): Promise<IMovieCredit[]>{
        const {page, perPage, matchFilters, pipelineFilters, populate = false} = params;
        const populatePipelines = populate ? this.populatePipelines() : [];

        return MovieCredit.aggregate([
            {$match: matchFilters},
            ...pipelineFilters,
            {$skip: (page - 1) * perPage},
            {$limit: perPage},
            ...populatePipelines,
        ]);
    }

    populatePipelines(): PopulatePipelineStages {
        return [
            {$lookup: {from: "Movie", localField: "movie", foreignField: "_id", as: "movie"}},
            {$lookup: {from: "Person", localField: "person", foreignField: "_id", as: "person"}},
            {$unwind: {path: "$movies", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$person", preserveNullAndEmptyArrays: true}},
        ];
    }
}