/**
 * @file MovieCreditQueryOptionService.ts
 * @summary
 * Query option service for MovieCredit list and search endpoints.
 *
 * @description
 * Provides a concrete implementation for building MongoDB-compatible
 * filters, sorts, and aggregation pipelines from validated URL query
 * parameters related to MovieCredit documents.
 *
 * Responsibilities:
 * - Validate and parse raw query parameters using Zod
 * - Generate root-level `$match` filters and `$sort` clauses
 * - Generate reference-based filter pipelines using `$lookup`
 * - Assemble unified query option objects for repository execution
 * - Generate post-pagination population pipelines
 *
 * This service acts as the boundary between HTTP query input
 * and database query construction for MovieCredit resources.
 */

import type {Request} from "express";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import {type FilterQuery, type SortOrder} from "mongoose";
import type {
    ReferenceFilterPipelineStages
} from "../../../../shared/types/mongoose/AggregatePipelineStages.js";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {IMovieCredit} from "../../models/MovieCredit.interface.js";
import {MovieCreditQueryOptionsSchema} from "../../schemas/query/MovieCreditQueryOption.schema.js";
import type {
    MovieCreditQueryMatchFilters,
    MovieCreditQueryOptions
} from "../../schemas/query/MovieCreditQueryOption.types.js";
import type {QueryOptionTypes} from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {LookupMatchStageOptions} from "../../../../shared/types/mongoose/LookupMatchStage.types.js";
import generateReferenceFilterPipelineStages
    from "../../../../shared/utility/mongoose/generateReferenceFilterPipelineStages.js";
import type {MovieCreditQueryOptionMethods} from "./MovieCreditQueryOptionService.types.js";

/**
 * Service responsible for constructing MovieCredit query options.
 *
 * @remarks
 * Supports filtering and sorting by both root-level MovieCredit fields
 * and referenced document fields (Movie, Person, RoleType).
 */
export default class MovieCreditQueryOptionService implements MovieCreditQueryOptionMethods {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @remarks
     * Removes nullish values after validation to ensure clean
     * downstream query construction.
     *
     * @param req - Express request containing raw query parameters.
     * @returns Validated and normalized {@link MovieCreditQueryOptions}.
     *
     * @throws {ZodParseError}
     * Thrown when query validation fails.
     */
    fetchQueryParams(req: Request): MovieCreditQueryOptions {
        const {success, error, data} =
            MovieCreditQueryOptionsSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                message: "Validation Failed.",
                errors: error.errors,
            });
        }

        return filterNullishAttributes(data);
    }

    /**
     * Generates root-level `$match` filters for MovieCredit queries.
     *
     * @remarks
     * Excludes reference-based filters, which are handled separately
     * via aggregation pipelines.
     *
     * @param options - Validated query options.
     * @returns A Mongoose {@link FilterQuery} for MovieCredit documents.
     */
    generateMatchFilters(options: MovieCreditQueryOptions): FilterQuery<MovieCreditQueryMatchFilters> {
        return filterNullishAttributes({
            _id: options._id,
            movie: options.movie,
            person: options.person,
            roleType: options.roleType,
            department: options.department,
            displayRoleName: options.displayRoleName,
            creditedAs: options.creditedAs,
            isPrimary: options.isPrimary,
            characterName: options.characterName,
            billingOrder: options.billingOrder,
            uncredited: options.uncredited,
            voiceOnly: options.voiceOnly,
            cameo: options.cameo,
            motionCapture: options.motionCapture,
            archiveFootage: options.archiveFootage,
        });
    }

    /**
     * Generates root-level sorting options for MovieCredit queries.
     *
     * @remarks
     * Only non-null sort directives are included.
     *
     * @param options - Validated query options containing sort directives.
     * @returns A partial mapping of MovieCredit fields to sort orders.
     */
    generateMatchSorts(options: MovieCreditQueryOptions): Partial<Record<keyof IMovieCredit, SortOrder>> {
        return filterNullishAttributes({
            creditedAs: options.sortByCreditedAs,
            characterName: options.sortByCharacterName,
            billingOrder: options.sortByBillingOrder,
        });
    }

    /**
     * Generates reference-level aggregation pipeline stages.
     *
     * @remarks
     * Uses `$lookup` stages with embedded match conditions to filter
     * MovieCredit documents by related Movie and RoleType fields.
     *
     * @param params - Validated query options.
     * @returns Aggregation pipeline stages for reference filtering.
     */
    generateReferenceFilters(params: MovieCreditQueryOptions): ReferenceFilterPipelineStages {
        const {roleName, movieSlug} = params;

        const stages: LookupMatchStageOptions[] = [
            {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "creditMovie",
                filters: filterNullishAttributes({slug: movieSlug}),
            },
            {
                from: "roletypes",
                localField: "roleType",
                foreignField: "_id",
                as: "creditRoleType",
                filters: filterNullishAttributes({name: roleName}),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Builds the complete query option object.
     *
     * @remarks
     * Combines root-level filters and sorts with reference-based
     * aggregation pipelines into a unified structure suitable
     * for repository execution.
     *
     * @param options - Validated query options.
     * @returns Fully composed {@link QueryOptionTypes}.
     */
    generateQueryOptions(options: MovieCreditQueryOptions): QueryOptionTypes<IMovieCredit, MovieCreditQueryMatchFilters> {
        return {
            match: {
                filters: this.generateMatchFilters(options),
                sorts: this.generateMatchSorts(options),
            },
            reference: {
                filters: this.generateReferenceFilters(options),
                sorts: [],
            },
        };
    }
}
