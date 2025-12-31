/**
 * @file ShowingQueryOptionService.ts
 * @summary
 * Query option service for the Showing domain.
 *
 * @description
 * Implements {@link IReferenceQueryOptionService} for the `Showing` model.
 * This service is responsible for translating validated URL query
 * parameters into Mongoose-compatible query objects and aggregation
 * pipeline stages.
 *
 * Responsibilities:
 * - Validate and parse raw query parameters using Zod
 * - Generate native `$match` filters and `$sort` clauses
 * - Generate reference-based filter pipelines using `$lookup`
 * - Assemble a unified query options object for repositories/services
 * - Provide population pipelines for resolving referenced documents
 *
 * This class acts as the boundary between HTTP query input and
 * database query construction.
 */

import type IReferenceQueryOptionService from "../../../../shared/types/query-options/IReferenceQueryOptionService.js";
import type {Request} from "express";
import type {
    ShowingQueryMatchFilters,
    ShowingQueryOptions
} from "../../schema/query/ShowingQueryOption.types.js";
import {ShowingQueryOptionSchema} from "../../schema/query/ShowingQueryOption.schema.js";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {
    QueryOptionTypes,
    SortQuery
} from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages
} from "../../../../shared/types/mongoose/AggregatePipelineStages.js";
import type {LookupMatchStageOptions} from "../../../../shared/types/mongoose/LookupMatchStage.types.js";
import generateReferenceFilterPipelineStages
    from "../../../../shared/utility/mongoose/generateReferenceFilterPipelineStages.js";
import type {ShowingSchemaFields} from "../../model/Showing.types.js";

/**
 * Service for building query options and aggregation pipelines
 * for Showing list/search endpoints.
 */
export default class ShowingQueryOptionService
    implements IReferenceQueryOptionService<
        ShowingSchemaFields,
        ShowingQueryOptions,
        ShowingQueryMatchFilters
    > {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request containing raw `req.query` values.
     * @returns A validated {@link ShowingQueryOptions} object.
     *
     * @throws {ZodParseError}
     * Thrown when query parameters fail schema validation.
     */
    fetchQueryParams(req: Request): ShowingQueryOptions {
        const {data, success, error} = ShowingQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                errors: error?.errors,
                raw: req.query,
                message: "Invalid Showing Query.",
            });
        }

        return data;
    }

    /**
     * Generates match-level filters for native Showing fields.
     *
     * @remarks
     * Only non-nullish attributes are included, ensuring clean
     * and minimal MongoDB `$match` conditions.
     *
     * @param options - Validated query options.
     * @returns A Mongoose {@link FilterQuery} for Showing documents.
     */
    generateMatchFilters(options: ShowingQueryOptions): FilterQuery<ShowingQueryMatchFilters> {
        return filterNullishAttributes({
            movie: options.movie,
            theatre: options.theatre,
            screen: options.screen,
            isSpecialEvent: options.isSpecialEvent,
            isActive: options.isActive,
            ticketPrice: options.ticketPrice,
            status: options.status,
        });
    }

    /**
     * Generates sorting options for native Showing fields.
     *
     * @remarks
     * Sort keys are mapped directly to schema fields and filtered
     * to exclude undefined values.
     *
     * @param options - Validated query options.
     * @returns A {@link SortQuery} compatible with Mongoose.
     */
    generateMatchSorts(options: ShowingQueryOptions): SortQuery<ShowingSchemaFields> {
        return filterNullishAttributes({
            startTime: options.sortByStartTime,
            endTime: options.sortByEndTime,
        });
    }

    /**
     * Generates reference-based filter pipeline stages.
     *
     * @remarks
     * Uses `$lookup` stages with embedded `$match` conditions to
     * filter by referenced document attributes (e.g. movie or theatre
     * metadata).
     *
     * @param options - Validated query options.
     * @returns Reference filter pipeline stages for aggregation.
     */
    generateReferenceFilters(options: ShowingQueryOptions): ReferenceFilterPipelineStages {
        const {
            movieTitle,
            movieSlug,
            theatreName,
            theatreState,
            theatreCity,
            theatreCountry,
        } = options;

        const stages: LookupMatchStageOptions[] = [
            {
                from: "movies",
                localField: "movie",
                foreignField: "title",
                as: "showingMovie",
                filters: filterNullishAttributes({
                    title: movieTitle,
                    slug: movieSlug,
                }),
            },
            {
                from: "theatres",
                localField: "theatre",
                foreignField: "name",
                as: "showingTheatre",
                filters: filterNullishAttributes({
                    name: theatreName,
                    "location.state": theatreState,
                    "location.city": theatreCity,
                    "location.country": theatreCountry,
                }),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Generates reference-based sort pipeline stages.
     *
     * @remarks
     * Currently no reference-level sorting is implemented.
     * This method exists to satisfy the service contract and
     * to allow future extension.
     *
     * @param options - Validated query options.
     * @returns An empty reference sort pipeline stage array.
     */
    generateReferenceSorts(options: ShowingQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    /**
     * Builds the full query option object.
     *
     * @remarks
     * Combines native match filters/sorts with reference-based
     * filter and sort pipelines into a single structured object
     * suitable for repositories or aggregation execution.
     *
     * @param options - Validated query options.
     * @returns Fully composed query option structure.
     */
    generateQueryOptions(options: ShowingQueryOptions): QueryOptionTypes<ShowingSchemaFields, ShowingQueryMatchFilters> {
        return {
            match: {
                filters: this.generateMatchFilters(options),
                sorts: this.generateMatchSorts(options),
            },
            reference: {
                filters: this.generateReferenceFilters(options),
                sorts: this.generateReferenceSorts(options),
            },
        };
    }

    /**
     * Generates population pipeline stages for Showings.
     *
     * @remarks
     * These stages resolve referenced documents and normalize
     * the output shape for consumers.
     *
     * @returns Aggregation pipeline stages for population.
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            // --- Lookups ---
            {$lookup: {from: "theatres", localField: "theatre", foreignField: "_id", as: "theatre"}},
            {$lookup: {from: "screens", localField: "screen", foreignField: "_id", as: "screen"}},
            {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},

            // --- Unwind ---
            {$unwind: "$theatre"},
            {$unwind: "$screen"},
            {$unwind: "$movie"},

            // --- Movie Genres ---
            {$lookup: {from: "genres", localField: "movie.genres", foreignField: "_id", as: "movie.genres"}},
        ];
    }
}
