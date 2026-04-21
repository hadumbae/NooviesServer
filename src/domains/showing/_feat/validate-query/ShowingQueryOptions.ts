/**
 * @fileoverview Transformation logic for Showing query options.
 * Consolidates match filters and sort orders into a structured
 * Mongoose aggregation pipeline configuration for showtime scheduling.
 */

import {z} from "zod";
import {ShowingQueryMatchFilterSchema} from "@domains/showing/_feat/validate-query/ShowingQueryMatchFilterSchema";
import {ShowingQueryMatchSortSchema} from "@domains/showing/_feat/validate-query/ShowingQueryMatchSortSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for Showing query options with an aggregation transformation.
 */
export const ShowingQueryOptionSchema =
    ShowingQueryMatchFilterSchema.merge(ShowingQueryMatchSortSchema).transform(
        (values): AggregateQueryOptions => ({
            match: {
                filters: {
                    $match: filterNullishAttributes({
                        movie: values.movie,
                        theatre: values.theatre,
                        screen: values.screen,
                        ticketPrice: values.ticketPrice,
                        isSpecialEvent: values.isSpecialEvent,
                        isActive: values.isActive,
                        status: values.status,
                    }),
                },
                sorts: {
                    $sort: filterNullishAttributes({
                        startTime: values.sortByStartTime,
                        endTime: values.sortByEndTime,
                    }),
                },
            },
        }),
    );

/**
 * TypeScript type inferred from the transformed ShowingQueryOptionSchema.
 */
export type ShowingQueryOptions = z.infer<typeof ShowingQueryOptionSchema>;