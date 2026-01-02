/**
 * @file ShowingQueryOptionService.ts
 *
 * Query option service for the Showing domain.
 *
 * Translates validated URL query parameters into Mongoose-compatible
 * query filters, sort objects, and aggregation pipeline stages.
 *
 * Responsibilities:
 * - Parse and validate query params
 * - Build native `$match` filters and `$sort` clauses
 * - Build reference-based `$lookup` filter pipelines
 * - Assemble a unified query option structure
 * - Provide population pipelines
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
 * Builds query options and aggregation pipelines for
 * Showing list and search endpoints.
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
     * @param req - Express request containing raw query params
     * @returns Validated Showing query options
     *
     * @throws {ZodParseError}
     * Thrown when validation fails
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
     * Generates match filters for native Showing fields.
     *
     * @param options - Validated query options
     * @returns MongoDB `$match` filter object
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
     * Generates sort options for native Showing fields.
     *
     * @param options - Validated query options
     * @returns Mongoose-compatible sort object
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
     * @param options - Validated query options
     * @returns Aggregation pipeline stages for reference filtering
     */
    generateReferenceFilters(options: ShowingQueryOptions): ReferenceFilterPipelineStages {
        const {
            movieSlug,
            screenSlug,
            theatreSlug,
            theatreState,
            theatreCity,
            theatreCountry,
        } = options;

        const stages: LookupMatchStageOptions[] = [
            {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "showingMovie",
                filters: filterNullishAttributes({
                    slug: movieSlug,
                }),
            },
            {
                from: "theatres",
                localField: "theatre",
                foreignField: "_id",
                as: "showingTheatre",
                filters: filterNullishAttributes({
                    slug: theatreSlug,
                    "location.state": theatreState,
                    "location.city": theatreCity,
                    "location.country": theatreCountry,
                }),
            },
            {
                from: "screens",
                localField: "screen",
                foreignField: "_id",
                as: "showingScreen",
                filters: filterNullishAttributes({
                    slug: screenSlug,
                }),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Generates reference-based sort pipeline stages.
     *
     * @remarks
     * No reference-level sorting is currently supported.
     */
    generateReferenceSorts(options: ShowingQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    /**
     * Builds the complete query option structure.
     *
     * @param options - Validated query options
     * @returns Composed query options
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
     * @returns Aggregation pipeline stages for population
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            // Lookups
            {$lookup: {from: "theatres", localField: "theatre", foreignField: "_id", as: "theatre"}},
            {$lookup: {from: "screens", localField: "screen", foreignField: "_id", as: "screen"}},
            {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},

            // Unwind
            {$unwind: "$theatre"},
            {$unwind: "$screen"},
            {$unwind: "$movie"},

            // Movie genres
            {$lookup: {from: "genres", localField: "movie.genres", foreignField: "_id", as: "movie.genres"}},
        ];
    }
}
