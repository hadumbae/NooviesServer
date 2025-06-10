import type {Request} from "express";
import {
    type MovieCreditQueryParams,
    MovieCreditQueryParamsSchema
} from "../schemas/query/MovieCreditQueryParamsSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import  {type FilterQuery, type PipelineStage} from "mongoose";
import type {MovieCreditMatchQueryParams} from "../schemas/query/MovieCreditMatchQueryParamsSchema.js";
import type {PopulatePipelineStages} from "../../../shared/types/mongoose/PopulatePipelineStages.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";

interface IMovieCreditQueryService {
    fetchQueryParams(req: Request<any, any, any, MovieCreditQueryParams>): MovieCreditQueryParams;

    generateMatchFilters(params: MovieCreditQueryParams): FilterQuery<MovieCreditMatchQueryParams>;

    generatePopulateFilters(params: MovieCreditQueryParams): PopulatePipelineStages;

    personLookup(match: {name?: string}): PipelineStage.Lookup;
    movieLookup(match: {title?: string}): PipelineStage.Lookup;
}

export default class MovieCreditQueryService implements IMovieCreditQueryService {

    fetchQueryParams(req: Request<any, any, any, MovieCreditQueryParams>): MovieCreditQueryParams {
        const {success, error, data} = MovieCreditQueryParamsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Validation Failed.", errors: error.errors});
        return data!;
    }

    generateMatchFilters(params: MovieCreditQueryParams): FilterQuery<MovieCreditMatchQueryParams> {
        const {name, title, ...matchFilters} = params;
        return filterNullArray(matchFilters);
    }

    generatePopulateFilters(params: MovieCreditQueryParams): PopulatePipelineStages {
        const {name, title} = params;

        const pipelines: PopulatePipelineStages = [];

        // Lookups
        if (name) pipelines.push(this.personLookup({name}));
        if (title) pipelines.push(this.movieLookup({title}));

        // Unwinds
        if (name) pipelines.push({$unwind: "$creditPerson"});
        if (title) pipelines.push({$unwind: "$creditMovie"});

        return pipelines;
    }

    personLookup(match: { name: string }): PipelineStage.Lookup {
        return {
            $lookup: {
                from: "Person",
                let: {personID: "$person"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$_id", "$$personID"]}}},
                    {$match: match}
                ],
                as: "creditPerson"
            }
        };
    }

    movieLookup(match: { title?: string }): PipelineStage.Lookup {
        return {
            $lookup: {
                from: "Movie",
                let: {movieID: "$movie"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$_id", "$$movieID"]}}},
                    {$match: match}
                ],
                as: "creditMovie"
            }
        };
    }
}