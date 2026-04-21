/**
 * @fileoverview Transformation logic for SeatMap query options.
 * Consolidates seating availability, pricing filters, and occupancy sorting into
 * a structured Mongoose aggregation pipeline configuration.
 */

import {z} from "zod";
import {SeatMapQueryMatchFilterSchema} from "@domains/seatmap/_feat/validate-query/SeatMapQueryMatchFilterSchema";
import {SeatMapQueryMatchSortSchema} from "@domains/seatmap/_feat/validate-query/SeatMapQueryMatchSortSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for SeatMap query options with an aggregation transformation.
 */
export const SeatMapQueryOptionsSchema =
    SeatMapQueryMatchFilterSchema.merge(SeatMapQueryMatchSortSchema).transform(
        (values): AggregateQueryOptions => ({
            match: {
                /** Constructs the MongoDB $match stage for the seat mapping. */
                filters: {
                    $match: filterNullishAttributes({
                        showing: values.showing,
                        seat: values.seat,
                        price: values.price,
                        status: values.status,
                    }),
                },
                /** Constructs the MongoDB $sort stage for ordering seats by price or availability. */
                sorts: {
                    $sort: filterNullishAttributes({
                        price: values.sortByPrice,
                        status: values.sortByStatus,
                    }),
                },
            },
        }),
    );

/**
 * TypeScript type inferred from the transformed SeatMapQueryOptionSchema.
 */
export type SeatMapQueryOptions = z.infer<typeof SeatMapQueryOptionsSchema>;