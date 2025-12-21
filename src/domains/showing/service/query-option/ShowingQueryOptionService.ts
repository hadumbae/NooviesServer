import type IReferenceQueryOptionService from "../../../../shared/types/query-options/IReferenceQueryOptionService.js";
import type {Request} from "express";
import type {ShowingQueryMatchFilters, ShowingQueryOptions} from "../../schema/query/ShowingQueryOption.types.js";
import {ShowingQueryOptionSchema} from "../../schema/query/ShowingQueryOption.schema.js";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {QueryOptionTypes, SortQuery} from "../../../../shared/types/query-options/QueryOptionService.types.js";
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
 * @file ShowingQueryOptionService.ts
 * @summary Service for parsing, validating, and transforming URL query parameters
 * into Mongoose aggregation pipelines and query objects for Showings.
 *
 * @description
 * Implements {@link IReferenceQueryOptionService} for the `Showing` model.
 * Provides methods to:
 * - Parse query parameters from Express requests with Zod validation
 * - Generate match filters and sorts for native fields
 * - Generate reference-based filter pipelines using `$lookup` stages
 * - Generate reference sort pipelines (currently empty)
 * - Produce fully combined query option objects
 * - Generate population pipelines for joining referenced documents
 */
export default class ShowingQueryOptionService implements IReferenceQueryOptionService<ShowingSchemaFields, ShowingQueryOptions, ShowingQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request object containing `req.query`.
     * @returns Validated `ShowingQueryOptions`.
     * @throws {ZodParseError} if query parameters fail validation.
     */
    fetchQueryParams(req: Request): ShowingQueryOptions {
        const {data, success, error} = ShowingQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                errors: error?.errors,
                raw: req.query,
                message: "Invalid Showing Query."
            });
        }

        return data;
    }

    /**
     * Generates match-level filters for native Showing fields.
     *
     * @param options - Validated query options.
     * @returns A `FilterQuery` object for Mongoose queries.
     */
    generateMatchFilters(options: ShowingQueryOptions): FilterQuery<ShowingQueryMatchFilters> {
        const checkedSL = options.subtitleLanguages?.length
            && {$all: options.subtitleLanguages};

        return filterNullishAttributes({
            movie: options.movie,
            theatre: options.theatre,
            screen: options.screen,
            language: options.language,
            subtitleLanguages: checkedSL,
            isSpecialEvent: options.isSpecialEvent,
            isActive: options.isActive,
            status: options.status,
        });
    }

    /**
     * Generates sorting options for native Showing fields.
     *
     * @param options - Validated query options.
     * @returns A `SortQuery` object for Mongoose queries.
     */
    generateMatchSorts(options: ShowingQueryOptions): SortQuery<ShowingSchemaFields> {
        return filterNullishAttributes({
            startTime: options.sortByStartTime,
            endTime: options.sortByEndTime,
            ticketPrice: options.sortByTicketPrice,
            isSpecialEvent: options.sortByIsSpecialEvent,
            isActive: options.sortByIsActive,
            status: options.sortByStatus,
        });
    }

    /**
     * Generates reference-based filter stages using `$lookup`.
     *
     * @param options - Validated query options.
     * @returns Reference filter pipeline stages suitable for Mongoose aggregation.
     */
    generateReferenceFilters(options: ShowingQueryOptions): ReferenceFilterPipelineStages {
        const {
            theatreName,
            screenName,
            movieTitle,
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
                    "location.country": theatreCountry
                }),
            },
            {
                from: "screens",
                localField: "screen",
                foreignField: "name",
                as: "showingScreen",
                filters: filterNullishAttributes({
                    screen: screenName,
                }),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Generates reference sort stages.
     *
     * @param params - Validated query options.
     * @returns Reference sort pipeline stages (currently empty).
     */
    generateReferenceSorts(params: ShowingQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    /**
     * Combines native and reference filters/sorts into a single query options object.
     *
     * @param options - Validated query options.
     * @returns Fully combined query options suitable for repository or aggregation use.
     */
    generateQueryOptions(options: ShowingQueryOptions): QueryOptionTypes<ShowingSchemaFields, ShowingQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);
        const referenceFilters = this.generateReferenceFilters(options);
        const referenceSorts = this.generateReferenceSorts(options);

        return {
            match: {filters: matchFilters, sorts: matchSorts},
            reference: {filters: referenceFilters, sorts: referenceSorts},
        };
    }

    /**
     * Generates population pipeline stages for joining referenced documents.
     *
     * @returns `PopulationPipelineStages` suitable for Mongoose aggregation pipelines.
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            // --- Lookup ---
            {$lookup: {from: "theatres", localField: "theatre", foreignField: "_id", as: "theatre"}},
            {$lookup: {from: "screens", localField: "screen", foreignField: "_id", as: "screen"}},
            {$lookup: {from: "movies", localField: "movie", foreignField: "_id", as: "movie"}},

            // --- Unwind ---
            {$unwind: "$theatre"},
            {$unwind: "$screen"},
            {$unwind: "$movie"},

            // --- Genres ---
            {$lookup: {from: "genres", localField: "movie.genres", foreignField: "_id", as: "movie.genres"}},
        ];
    }
}
