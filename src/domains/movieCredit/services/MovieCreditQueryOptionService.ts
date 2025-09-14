import type {Request} from "express";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import {type FilterQuery, type PipelineStage, type SortOrder} from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";
import type {IMovieCredit} from "../models/MovieCredit.interface.js";
import {MovieCreditQueryOptionsSchema} from "../schemas/query/MovieCreditFilters.schema.js";
import type {
    MovieCreditQueryMatchFilters,
    MovieCreditQueryOptions
} from "../schemas/query/MovieCreditFilters.types.js";

/**
 * Interface defining the MovieCreditQueryOptionService methods.
 */
interface IMovieCreditQueryOptionService
    extends IQueryOptionService<IMovieCredit, MovieCreditQueryOptions, MovieCreditQueryMatchFilters> {

    /**
     * Generates an array of MongoDB aggregation pipeline stages for population.
     * @param params - Query options containing optional filters for population.
     */
    generatePopulateFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages;

    /**
     * Builds post-pagination stages for enriching results with Person, Movie, and RoleType documents.
     */
    generatePopulationPipelines(): PopulationPipelineStages;

    /**
     * Generates a $lookup pipeline stage to populate the 'creditPerson' field.
     * @param match - Optional filter containing a person's name.
     * @param match.name - Name to filter by (case-insensitive regex)
     */
    personLookup(match: { name?: string }): PipelineStage.Lookup;

    /**
     * Generates a $lookup pipeline stage to populate the 'creditMovie' field.
     * @param match - Optional filter containing a movie title.
     * @param match.title - Title to filter by (case-insensitive regex)
     */
    movieLookup(match: { title?: string }): PipelineStage.Lookup;

    /**
     * Generates a $lookup pipeline stage to populate the 'creditRoleType' field.
     * @param match - Optional filter containing a role name.
     * @param match.roleName - Role name to filter by (case-insensitive regex)
     */
    roleTypeLookup(match: { roleName?: string }): PipelineStage.Lookup;
}

/**
 * Service for building queries, sorts, and aggregation pipelines for MovieCredit documents.
 * Supports filtering, sorting, and population of related Person, Movie, and RoleType documents.
 */
export default class MovieCreditQueryOptionService implements IMovieCreditQueryOptionService {

    /**
     * Parses and validates query parameters from an Express request using Zod.
     * Removes null or undefined values from the resulting object.
     *
     * @param req - Express request object
     * @returns A validated and cleaned MovieCreditQueryOptions object
     * @throws {ZodParseError} If validation fails
     */
    fetchQueryParams(req: Request): MovieCreditQueryOptions {
        const {success, error, data} = MovieCreditQueryOptionsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Validation Failed.", errors: error.errors});
        return filterNullArray(data);
    }

    /**
     * Generates a Mongoose filter query object based on MovieCreditQueryOptions.
     * Removes null or undefined fields.
     *
     * @param options - Query options from the client
     * @returns FilterQuery object for Mongoose
     */
    generateMatchFilters(options: MovieCreditQueryOptions): FilterQuery<MovieCreditQueryMatchFilters> {
        const {
            name,
            title,
            roleName,
            sortByDepartment,
            sortByMovie,
            sortByPerson,
            sortByBillingOrder,
            ...matchFilters
        } = options;

        return filterNullArray(matchFilters);
    }

    /**
     * Generates sorting options for a Mongoose query based on MovieCreditQueryOptions.
     * Only includes fields with non-null sort orders.
     *
     * @param options - Query options containing sort fields
     * @returns Partial record mapping IMovieCredit fields to SortOrder
     */
    generateQuerySorts(options: MovieCreditQueryOptions): Partial<Record<keyof IMovieCredit, SortOrder>> {
        const {sortByDepartment, sortByMovie, sortByPerson, sortByBillingOrder} = options;
        const sorts: Partial<Record<keyof IMovieCredit, SortOrder | undefined>> = {
            department: sortByDepartment,
            movie: sortByMovie,
            person: sortByPerson,
            billingOrder: sortByBillingOrder,
        };

        return filterNullArray(sorts);
    }

    /**
     * Builds post-pagination stages to populate Movie, Person, and RoleType references.
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},
            {$lookup: {from: "people", localField: "person", foreignField: "_id", as: "person"}},
            {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
            {$unwind: {path: "$movie", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$person", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "$roleType", preserveNullAndEmptyArrays: true}},
        ];
    }

    /**
     * Generates an array of populate pipeline stages for aggregation based on the provided options.
     * Adds lookups and optional unwinds for person, movie, and roleType references.
     *
     * @param params - Query options containing optional filters for population
     * @returns Array of MongoDB aggregation pipeline stages
     */
    generatePopulateFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages {
        const {name, title, roleName} = params;

        const pipelines: ReferenceFilterPipelineStages = [];

        // Lookups
        if (name) pipelines.push(this.personLookup({name}));
        if (title) pipelines.push(this.movieLookup({title}));
        if (roleName) pipelines.push(this.roleTypeLookup({roleName}));

        // Unwinds

        if (name) {
            pipelines.push({$unwind: "$creditPerson"});
            pipelines.push({$unset: "$creditPerson"});
        }

        if (title) {
            pipelines.push({$unwind: "$creditMovie"});
            pipelines.push({$unset: "$creditMovie"});
        }

        if (roleName) {
            pipelines.push({$unwind: "$creditRoleType"});
            pipelines.push({$unset: "$creditRoleType"});
        }

        return pipelines;
    }

    /**
     * Generates a $lookup pipeline stage to populate the 'creditPerson' field.
     * Applies optional case-insensitive name filtering if provided.
     *
     * @param name - Optional name to filter by (case-insensitive regex)
     * @returns MongoDB $lookup pipeline stage
     */
    personLookup({name}: { name?: string }): PipelineStage.Lookup {
        const filters = {...(name && {name: {$regex: name, $options: "i"}})};

        return {
            $lookup: {
                from: "people",
                let: {personID: "$person"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$_id", "$$personID"]}}},
                    {$match: filters}
                ],
                as: "creditPerson"
            }
        };
    }

    /**
     * Generates a $lookup pipeline stage to populate the 'creditMovie' field.
     * Applies optional case-insensitive title filtering if provided.
     *
     * @param title - Optional title to filter by (case-insensitive regex)
     * @returns MongoDB $lookup pipeline stage
     */
    movieLookup({title}: { title?: string }): PipelineStage.Lookup {
        const filters = {...(title && {title: {$regex: title, $options: "i"}})};

        return {
            $lookup: {
                from: "movies",
                let: {movieID: "$movie"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$_id", "$$movieID"]}}},
                    {$match: filters}
                ],
                as: "creditMovie"
            }
        };
    }

    /**
     * Generates a $lookup pipeline stage to populate the 'creditRoleType' field.
     * Applies optional case-insensitive roleName filtering if provided.
     *
     * @param roleName - Optional role name to filter by (case-insensitive regex)
     * @returns MongoDB $lookup pipeline stage
     */
    roleTypeLookup({roleName}: { roleName?: string }): PipelineStage.Lookup {
        const filters = {...(roleName && {roleName: {$regex: roleName, $options: "i"}})};

        return {
            $lookup: {
                from: "roletypes",
                let: {roleTypeID: "$roleType"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$_id", "$$roleTypeID"]}}},
                    {$match: filters}
                ],
                as: "creditRoleType"
            }
        };
    }
}