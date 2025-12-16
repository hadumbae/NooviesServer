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
import type { FilterQuery, PipelineStage, SortOrder } from "mongoose";
import { SeatQueryMatchFiltersSchema } from "../schema/query/SeatQueryOption.schema.js";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
import type {
    SeatQueryMatchFilters,
    SeatQueryOptions,
} from "../schema/query/SeatQueryOption.types.js";
import type ISeat from "../model/Seat.interface.js";
import type { QueryOptionTypes } from "../../../shared/types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages,
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import generateLookupMatchStage from "../../../shared/utility/mongoose/generateLookupMatchStage.js";
import type IReferenceQueryOptionService from "../../../shared/types/query-options/IReferenceQueryOptionService.js";

/**
 * Service class for managing query options for Seat documents, including reference pipelines.
 *
 * @implements IReferenceQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters>
 */
export default class SeatQueryOptionService
    implements IReferenceQueryOptionService<ISeat, SeatQueryOptions, SeatQueryMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     *
     * @param req - Express request object
     * @returns Validated and filtered `SeatQueryOptions`
     */
    fetchQueryParams(req: Request): SeatQueryOptions {
        const conditions = SeatQueryMatchFiltersSchema.parse(req.query);
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
    generateMatchSorts(params: SeatQueryOptions): Partial<Record<keyof ISeat, SortOrder>> {
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
        const { showing } = params;
        const pipelineStages: ReferenceFilterPipelineStages = [];
        const matchStages: Record<string, any> = {};

        if (showing) {
            const lookup: PipelineStage.Lookup = generateLookupMatchStage({
                from: "showings",
                localField: "screen",
                foreignField: "screen",
                as: "showing",
                filters: { _id: showing },
            });

            pipelineStages.push(lookup);
            matchStages.showing = { $ne: [] };
        }

        if (Object.keys(matchStages).length > 0) {
            pipelineStages.push({ $match: matchStages });
            pipelineStages.push({ $unset: ["showing"] });
        }

        return pipelineStages;
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
            { $unwind: { path: "screen", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "theatre", preserveNullAndEmptyArrays: true } },
        ];
    }

    /**
     * Combines `$match` filters, `$sort` options, reference filters, and population pipelines into a single query object.
     *
     * @param options - Validated `SeatQueryOptions`
     * @returns `QueryOptionTypes<ISeat, SeatQueryMatchFilters>` containing match filters, sorts, and reference pipelines
     */
    generateQueryOptions(options: SeatQueryOptions): QueryOptionTypes<ISeat, SeatQueryMatchFilters> {
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
