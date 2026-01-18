/**
 * @file SeatQueryOptionService.ts
 * @summary Service for parsing, validating, and generating query options for Seat documents, including reference pipelines.
 *
 * @description
 * Implements `IReferenceQueryOptionService` to standardize query handling for `ISeat`.
 * Provides methods to:
 * - Extract and validate query parameters from Express requests
 * - Generate Mongoose `$match` filters and `$sort` options
 * - Build reference filters for related documents (e.g., Showings)
 * - Generate population pipelines for related documents
 * - Combine filters, sorts, and reference stages into a unified query object
 *
 * @example
 * ```ts
 * const service = new SeatQueryOptionService();
 * const queryParams = service.fetchQueryParams(req);
 * const queryOptions = service.generateQueryOptions(queryParams);
 * ```
 */

import type { Request } from "express";
import type { FilterQuery, SortOrder } from "mongoose";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import type {SeatSchemaFields} from "../model/Seat.types.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages,
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import type IReferenceQueryOptionService from "../../../shared/types/query-options/IReferenceQueryOptionService.js";
import {type SeatQueryMatchFilters} from "../schema/query/SeatMatchParams.js";
import type {LookupMatchStageOptions} from "../../../shared/types/mongoose/LookupMatchStage.types.js";
import generateReferenceFilterPipelineStages
    from "../../../shared/utility/mongoose/generateReferenceFilterPipelineStages.js";
import {type SeatQueryOptions, SeatQueryOptionsSchema} from "../schema/query/SeatQueryOptions.js";

/**
 * Service class for managing query options for Seat documents, including reference pipelines.
 *
 * @implements IReferenceQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters>
 */
export default class SeatQueryOptionService
    implements IReferenceQueryOptionService<SeatSchemaFields, SeatQueryOptions, SeatQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request object
     * @returns Validated and filtered `SeatQueryOptions`
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryOptionsSchema.parse(req.query);
        return filterNullishAttributes(conditions) as SeatQueryOptions;
    }

    /**
     * Generates Mongoose `$match` filters for Seat documents.
     *
     * @param params - Validated `SeatQueryOptions`
     * @returns Mongoose-compatible filter object (`FilterQuery<SeatQueryMatchFilters>`)
     */
    generateMatchFilters(params: SeatQueryOptions): FilterQuery<SeatQueryMatchFilters> {
        const {
            _id,
            row,
            seatNumber,
            seatLabel,
            seatType,
            layoutType,
            isAvailable,
            theatre,
            screen,
        } = params;

        const filters = {
            _id,
            row: row && { $regex: row, $options: "i" },
            seatLabel: seatLabel && { $regex: seatLabel, $options: "i" },
            seatNumber,
            seatType,
            layoutType,
            isAvailable,
            theatre,
            screen,
        };

        return filterNullishAttributes(filters);
    }

    /**
     * Generates Mongoose `$sort` options for Seat documents.
     *
     * @param params - Validated `SeatQueryOptions`
     * @returns Partial record mapping Seat fields to `SortOrder`
     */
    generateMatchSorts(params: SeatQueryOptions): Partial<Record<keyof SeatSchemaFields, SortOrder>> {
        const {
            sortByRow,
            sortBySeatNumber,
            sortBySeatLabel,
            sortBySeatType,
            sortByTheatre,
            sortByScreen,
            sortByIsAvailable,
            sortByPriceMultiplier,
        } = params;

        const sorts = {
            theatre: sortByTheatre,
            screen: sortByScreen,
            row: sortByRow,
            seatNumber: sortBySeatNumber,
            seatLabel: sortBySeatLabel,
            seatType: sortBySeatType,
            isAvailable: sortByIsAvailable,
            priceMultiplier: sortByPriceMultiplier,
        };

        return filterNullishAttributes(sorts);
    }

    /**
     * Generates reference filter pipeline stages for related documents.
     *
     * @param params - Validated `SeatQueryOptions`
     * @returns Mongoose aggregation pipeline stages (`ReferenceFilterPipelineStages`)
     */
    generateReferenceFilters(params: SeatQueryOptions): ReferenceFilterPipelineStages {
        const { showing, showingSlug, theatreSlug, screenSlug } = params;

        console.log("Screen Slug: ", params);

        const stages: LookupMatchStageOptions[] = [
            {
                from: "showings",
                localField: "screen",
                foreignField: "screen",
                as: "seatShowing",
                filters: filterNullishAttributes({
                   _id: showing,
                   slug: showingSlug,
                }),
            },
            {
                from: "screens",
                localField: "screen",
                foreignField: "_id",
                as: "seatScreen",
                filters: filterNullishAttributes({
                    slug: screenSlug,
                }),
            },
            {
                from: "theatres",
                localField: "theatre",
                foreignField: "_id",
                as: "seatTheatre",
                filters: filterNullishAttributes({
                    slug: theatreSlug,
                }),
            },
        ];

        console.log("Stages: ", stages);

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Generates reference sort pipeline stages (currently empty).
     *
     * @param params - Validated `SeatQueryOptions`
     * @returns Reference sort pipeline stages (`ReferenceSortPipelineStages`)
     */
    generateReferenceSorts(params: SeatQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    /**
     * Generates aggregation pipeline stages for populating referenced documents (e.g., screens, theatres).
     *
     * @returns Population pipeline stages (`PopulationPipelineStages`)
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            { $lookup: { from: "screens", localField: "screen", foreignField: "_id", as: "screen" } },
            { $lookup: { from: "theatres", localField: "theatre", foreignField: "_id", as: "theatre" } },
            { $unwind: { path: "$screen", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$theatre", preserveNullAndEmptyArrays: true } },
        ];
    }

    /**
     * Combines `$match` filters, `$sort` options, reference filters, and population pipelines into a single query object.
     *
     * @param options - Validated `SeatQueryOptions`
     * @returns `QueryOptionTypes<ISeat, SeatQueryMatchFilters>` containing match filters, sorts, and reference pipelines
     */
    generateQueryOptions(options: SeatQueryOptions): QueryOptionTypes<SeatSchemaFields, SeatQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);
        const referenceFilters = this.generateReferenceFilters(options);
        const referenceSorts = this.generateReferenceSorts(options);

        return {
            match: { filters: matchFilters, sorts: matchSorts },
            reference: { filters: referenceFilters, sorts: referenceSorts },
        };
    }
}
