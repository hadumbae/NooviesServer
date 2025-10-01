import type { Request } from "express";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import { type FilterQuery, type SortOrder } from "mongoose";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type IQueryOptionService from "../../../shared/types/query-options/QueryOptionService.interface.js";
import type { IMovieCredit } from "../models/MovieCredit.interface.js";
import { MovieCreditQueryOptionsSchema } from "../schemas/query/MovieCreditQueryOption.schema.js";
import type {
    MovieCreditQueryMatchFilters,
    MovieCreditQueryOptions
} from "../schemas/query/MovieCreditQueryOption.types.js";
import generateLookupMatchStage from "../../../shared/utility/generateLookupMatchStage.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * Interface defining methods for building query options specific to MovieCredit documents.
 * Extends the generic {@link IQueryOptionService}.
 */
interface IMovieCreditQueryOptionService
    extends IQueryOptionService<IMovieCredit, MovieCreditQueryOptions, MovieCreditQueryMatchFilters> {

    /**
     * Generates an array of MongoDB aggregation pipeline stages
     * for applying reference-based filters (e.g., filtering by person name, movie title).
     *
     * @param params - Query options containing optional filters for related collections.
     * @returns Array of `$lookup`, `$match`, and `$unset` stages used in filtering.
     */
    generateReferenceFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages;

    /**
     * Builds post-pagination population stages for enriching MovieCredit results
     * with related Person, Movie, and RoleType documents.
     *
     * @returns Array of `$lookup` and `$unwind` stages used for population.
     */
    generatePopulationPipelines(): PopulationPipelineStages;
}

/**
 * Service for constructing queries, filters, sorts, and aggregation pipelines
 * for MovieCredit documents. Supports filtering by root-level fields
 * (e.g., department, roleType) and reference-level fields
 * (e.g., person name, movie title, role name).
 */
export default class MovieCreditQueryOptionService implements IMovieCreditQueryOptionService {

    /**
     * Parses and validates query parameters from an Express request using Zod.
     * Automatically removes `null` or `undefined` values for cleaner queries.
     *
     * @param req - Express request containing query string parameters.
     * @returns A validated {@link MovieCreditQueryOptions} object.
     * @throws {ZodParseError} If query validation fails.
     */
    fetchQueryParams(req: Request): MovieCreditQueryOptions {
        const { success, error, data } = MovieCreditQueryOptionsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({ message: "Validation Failed.", errors: error.errors });
        return filterNullArray(data);
    }

    /**
     * Generates root-level MongoDB filter conditions for MovieCredit queries.
     * Excludes reference-based filters (name, title, roleName).
     *
     * @param options - Query options provided by the client.
     * @returns A {@link FilterQuery} object for MovieCredit documents.
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
     * Generates sorting options for MovieCredit queries.
     * Only includes fields with valid (non-null) sort orders.
     *
     * @param options - Query options containing sort fields.
     * @returns A partial record mapping {@link IMovieCredit} fields to sort orders.
     */
    generateMatchSorts(options: MovieCreditQueryOptions): Partial<Record<keyof IMovieCredit, SortOrder>> {
        const { sortByDepartment, sortByMovie, sortByPerson, sortByBillingOrder } = options;
        const sorts: Partial<Record<keyof IMovieCredit, SortOrder | undefined>> = {
            department: sortByDepartment,
            movie: sortByMovie,
            person: sortByPerson,
            billingOrder: sortByBillingOrder,
        };

        return filterNullArray(sorts);
    }

    /**
     * Generates reference-level MongoDB aggregation stages for filtering
     * by related documents (e.g., Person, Movie, RoleType).
     *
     * Uses `$lookup` + `$match` to filter joined documents by regex,
     * then unsets temporary lookup fields.
     *
     * @param params - Query options including reference-based filters.
     * @returns Array of `$lookup`, `$match`, and `$unset` stages.
     *
     * @example
     * ```ts
     * const stages = service.generateReferenceFilters({ name: "Tom" });
     * // Produces lookup and match stages that only keep MovieCredits
     * // where the associated person's name matches "Tom".
     * ```
     */
    generateReferenceFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages {
        const { name, title, roleName } = params;

        const pipelines: ReferenceFilterPipelineStages = [];
        const matchStage: Record<string, any> = {};

        if (name) {
            const filters = { name: { $regex: name, $options: "i" } };

            const pipeline = generateLookupMatchStage({
                from: "people",
                as: "creditPerson",
                localField: "person",
                foreignField: "_id",
                project: { name: 1 },
                filters,
            });

            pipelines.push(pipeline);
            matchStage.creditPerson = { $ne: [] };
        }

        if (title) {
            const filters = { title: { $regex: title, $options: "i" } };

            const pipeline = generateLookupMatchStage({
                from: "movies",
                as: "creditMovie",
                localField: "movie",
                foreignField: "_id",
                project: { title: 1 },
                filters,
            });

            pipelines.push(pipeline);
            matchStage.creditMovie = { $ne: [] };
        }

        if (roleName) {
            const filters = { roleName: { $regex: roleName, $options: "i" } };

            const pipeline = generateLookupMatchStage({
                from: "roletypes",
                as: "creditRoleType",
                localField: "roleType",
                foreignField: "_id",
                project: { roleName: 1 },
                filters,
            });

            pipelines.push(pipeline);
            matchStage.creditRoleType = { $ne: [] };
        }

        if (Object.keys(matchStage).length > 0) {
            pipelines.push({ $match: matchStage });
            pipelines.push({ $unset: ["creditPerson", "creditMovie", "creditRoleType"] });
        }

        return pipelines;
    }

    /**
     * Combines root-level filters, reference filters, and sort rules
     * into a single {@link QueryOptionTypes} object.
     *
     * @param options - The query options provided by the client.
     * @returns Query options structured for both root and reference queries.
     */
    generateQueryOptions(
        options: MovieCreditQueryOptions
    ): QueryOptionTypes<IMovieCredit, MovieCreditQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const referenceFilters = this.generateReferenceFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
            reference: { filters: referenceFilters, sorts: [] },
        };
    }

    /**
     * Builds post-pagination pipeline stages to populate
     * Person, Movie, and RoleType references in query results.
     *
     * @returns Array of `$lookup` and `$unwind` stages used for population.
     *
     * @example
     * ```ts
     * const stages = service.generatePopulationPipelines();
     * // Produces lookups for movies, people, and roletypes,
     * // and unwinds them to embed the related documents.
     * ```
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            { $lookup: { from: "movies", localField: "movie", foreignField: "_id", as: "movie" } },
            { $lookup: { from: "people", localField: "person", foreignField: "_id", as: "person" } },
            { $lookup: { from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType" } },
            { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$person", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$roleType", preserveNullAndEmptyArrays: true } },
        ];
    }
}
