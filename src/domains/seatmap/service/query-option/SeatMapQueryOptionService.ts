import type { Request } from "express";
import type ISeatMap from "../../model/SeatMap.interface.js";
import type { SeatMapMatchFilters, SeatMapQueryOptions } from "../../schema/query-option/SeatMapQueryOption.types.js";
import type IReferenceQueryOptionService from "../../../../shared/types/query-options/IReferenceQueryOptionService.js";
import { SeatMapQueryOptionSchema } from "../../schema/query-option/SeatMapQueryOption.schema.js";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type { FilterQuery, SortOrder } from "mongoose";
import type { QueryOptionTypes, SortQuery } from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages
} from "../../../../shared/types/mongoose/AggregatePipelineStages.js";
import generateLookupMatchStage from "../../../../shared/utility/mongoose/generateLookupMatchStage.js";
import buildAggregationSort from "../../../../shared/utility/mongoose/buildAggregationSort.js";

/**
 * Service for parsing, validating, and generating Mongoose query options
 * for the `SeatMap` model, including both direct document fields
 * and referenced fields for population and aggregation.
 *
 * Implements `IReferenceQueryOptionService` for standardized reference
 * filtering and population pipelines.
 */
export default class SeatMapQueryOptionService
    implements IReferenceQueryOptionService<ISeatMap, SeatMapQueryOptions, SeatMapMatchFilters> {

    /**
     * Parses and validates query parameters from an Express request.
     * Filters out any nullish values.
     *
     * @param req - Express request object containing query parameters.
     * @returns Validated and cleaned SeatMap query options.
     * @throws {ZodParseError} if query parameters fail schema validation.
     */
    fetchQueryParams(req: Request): SeatMapQueryOptions {
        const { success, data, error } = SeatMapQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                message: "Failed to parse 'SeatMap' query options.",
                errors: error.errors,
            });
        }

        return filterNullishAttributes(data);
    }

    /**
     * Generates MongoDB match filters for direct SeatMap document fields.
     *
     * @param options - Validated SeatMap query options.
     * @returns FilterQuery containing only non-nullish direct field filters.
     */
    generateMatchFilters(options: SeatMapQueryOptions): FilterQuery<SeatMapMatchFilters> {
        const { showing, seat, price, status } = options;

        return filterNullishAttributes({ showing, seat, price, status });
    }

    /**
     * Generates MongoDB sort options for direct SeatMap document fields.
     *
     * @param options - Validated SeatMap query options.
     * @returns SortQuery containing only non-nullish direct field sorts.
     */
    generateMatchSorts(options: SeatMapQueryOptions): SortQuery<ISeatMap> {
        const { sortByPrice, sortByStatus } = options;

        return filterNullishAttributes({ price: sortByPrice, status: sortByStatus });
    }

    /**
     * Generates aggregation pipelines for filtering based on referenced fields
     * (e.g., Movie, Showing, Seat).
     *
     * @param params - SeatMap query options.
     * @returns Aggregation stages for reference-based filtering.
     */
    generateReferenceFilters(params: SeatMapQueryOptions): ReferenceFilterPipelineStages {
        const { movie, showingStatus, seatRow, seatNumber, seatType } = params;

        const pipelines: ReferenceFilterPipelineStages = [];
        const matchStage: Record<string, any> = {};

        if (movie || showingStatus) {
            const filters = filterNullishAttributes({ movie, status: showingStatus });

            pipelines.push(generateLookupMatchStage({
                from: "showings",
                as: "refShowing",
                localField: "showing",
                foreignField: "_id",
                project: { movie: 1, status: 1 },
                filters,
            }));

            matchStage.refShowing = { $ne: [] };
        }

        if (seatRow || seatNumber || seatType) {
            const filters = filterNullishAttributes({ row: seatRow, seatNumber, seatType });

            pipelines.push(generateLookupMatchStage({
                from: "seats",
                as: "refSeat",
                localField: "showing",
                foreignField: "_id",
                project: { row: 1, seatNumber: 1, seatType: 1 },
                filters,
            }));

            matchStage.refSeat = { $ne: [] };
        }

        if (Object.keys(matchStage).length > 0) {
            pipelines.push({ $match: matchStage });
            pipelines.push({ $unset: ["refShowing", "refSeat"] });
        }

        return pipelines;
    }

    /**
     * Generates aggregation pipelines for sorting based on referenced fields.
     *
     * @param params - SeatMap query options.
     * @returns Aggregation stages for reference-based sorting.
     */
    generateReferenceSorts(params: SeatMapQueryOptions): ReferenceSortPipelineStages {
        const { sortBySeatRow: row, sortBySeatNumber: seatNumber } = params;

        const pipelines: ReferenceSortPipelineStages = [];

        if (row || seatNumber) {
            pipelines.push({ $lookup: { from: "seats", localField: "seat", foreignField: "_id", as: "refSeat" } });
            pipelines.push({ $unwind: { path: "refSeat" } });
        }

        const sortStage: Record<string, SortOrder> = filterNullishAttributes({
            "refSeat.row": row,
            "refSeat.seatNumber": seatNumber,
        });

        if (Object.keys(sortStage).length > 0) {
            pipelines.push({ $sort: buildAggregationSort(sortStage) });
            pipelines.push({ $unset: ["refSeat"] });
        }

        return pipelines;
    }

    /**
     * Generates full query options for SeatMap queries, including direct match
     * filters, match sorts, reference filters, and reference sorts.
     *
     * @param options - Validated SeatMap query options.
     * @returns Complete query option object suitable for aggregation or find queries.
     */
    generateQueryOptions(options: SeatMapQueryOptions): QueryOptionTypes<ISeatMap, SeatMapMatchFilters> {
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
     * Generates Mongoose population pipelines for SeatMap references.
     *
     * @returns Aggregation stages to populate `seat` and `showing` fields.
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            { $lookup: { from: "seats", localField: "seat", foreignField: "_id", as: "seat" } },
            { $lookup: { from: "showings", localField: "showing", foreignField: "_id", as: "showing" } },
            { $unwind: { path: "seat", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "showing", preserveNullAndEmptyArrays: true } },
        ];
    }
}
