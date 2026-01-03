/**
 * @file SeatMapQueryOptionService.ts
 *
 * @summary
 * Query option service for the SeatMap domain.
 *
 * @description
 * Translates validated URL query parameters into Mongoose-compatible
 * match filters, sort objects, and aggregation pipeline stages.
 */

import type {Request} from "express";
import type IReferenceQueryOptionService from "../../../../shared/types/query-options/IReferenceQueryOptionService.js";
import {
    type SeatMapQueryOptions,
    SeatMapQueryOptionSchema
} from "../../schema/query-option/SeatMapQueryOption.schema.js";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {FilterQuery} from "mongoose";
import type {QueryOptionTypes, SortQuery} from "../../../../shared/types/query-options/QueryOptionService.types.js";
import type {
    PopulationPipelineStages,
    ReferenceFilterPipelineStages,
    ReferenceSortPipelineStages
} from "../../../../shared/types/mongoose/AggregatePipelineStages.js";
import type {SeatMapSchemaFields} from "../../model/SeatMap.types.js";
import type {LookupMatchStageOptions} from "../../../../shared/types/mongoose/LookupMatchStage.types.js";
import generateReferenceFilterPipelineStages
    from "../../../../shared/utility/mongoose/generateReferenceFilterPipelineStages.js";
import type {SeatMapMatchFilters} from "../../schema/query-option/SeatMapMatchParam.schema.js";

/**
 * Query option service for SeatMap list and search endpoints.
 */
export default class SeatMapQueryOptionService
    implements IReferenceQueryOptionService<
        SeatMapSchemaFields,
        SeatMapQueryOptions,
        SeatMapMatchFilters
    > {

    /**
     * Parses and validates SeatMap query parameters.
     *
     * @param req - Express request
     * @returns Validated query options
     *
     * @throws {ZodParseError}
     */
    fetchQueryParams(req: Request): SeatMapQueryOptions {
        const {success, data, error} = SeatMapQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                message: "Failed to parse SeatMap query options.",
                errors: error.errors,
            });
        }

        return filterNullishAttributes(data);
    }

    /**
     * Builds `$match` filters for native SeatMap fields.
     */
    generateMatchFilters(options: SeatMapQueryOptions): FilterQuery<SeatMapMatchFilters> {
        const {showing, seat, price, status} = options;
        return filterNullishAttributes({showing, seat, price, status});
    }

    /**
     * Builds `$sort` options for native SeatMap fields.
     */
    generateMatchSorts(options: SeatMapQueryOptions): SortQuery<SeatMapSchemaFields> {
        const {sortByPrice, sortByStatus} = options;
        return filterNullishAttributes({price: sortByPrice, status: sortByStatus});
    }

    /**
     * Builds reference-based filter pipeline stages.
     */
    generateReferenceFilters(options: SeatMapQueryOptions): ReferenceFilterPipelineStages {
        const {movie, showingSlug, showingStatus, seatRow, seatNumber, seatType} = options;

        const stages: LookupMatchStageOptions[] = [
            {
                from: "showings",
                as: "refShowing",
                localField: "showing",
                foreignField: "_id",
                project: {movie: 1, slug: 1, status: 1},
                filters: filterNullishAttributes({
                    movie,
                    slug: showingSlug,
                    status: showingStatus,
                }),
            },
            {
                from: "seats",
                as: "refSeat",
                localField: "seat",
                foreignField: "_id",
                project: {row: 1, seatNumber: 1, seatType: 1},
                filters: filterNullishAttributes({
                    row: seatRow,
                    seatNumber,
                    seatType,
                }),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    /**
     * Builds reference-based sort pipeline stages.
     */
    generateReferenceSorts(options: SeatMapQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    /**
     * Builds the composed query option structure.
     */
    generateQueryOptions(
        options: SeatMapQueryOptions
    ): QueryOptionTypes<SeatMapSchemaFields, SeatMapMatchFilters> {
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
     * Builds population pipeline stages for SeatMap documents.
     */
    generatePopulationPipelines(): PopulationPipelineStages {
        return [
            {$lookup: {from: "seats", localField: "seat", foreignField: "_id", as: "seat"}},
            {$lookup: {from: "showings", localField: "showing", foreignField: "_id", as: "showing"}},
            {$unwind: {path: "seat", preserveNullAndEmptyArrays: true}},
            {$unwind: {path: "showing", preserveNullAndEmptyArrays: true}},
        ];
    }
}
