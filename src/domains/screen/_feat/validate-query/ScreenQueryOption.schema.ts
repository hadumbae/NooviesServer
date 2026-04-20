/**
 * @fileoverview Transformation logic for Screen query options.
 * Maps raw URL parameters into a structured Mongoose/MongoDB aggregation-compatible format.
 */

import {z} from "zod";
import {ScreenQueryMatchFilterSchema} from "@domains/screen/_feat/validate-query/ScreenQueryMatchFilterSchema";
import {ScreenQueryMatchSortSchema} from "@domains/screen/_feat/validate-query/ScreenQueryMatchSortSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema with a transformation layer for Screen aggregation.
 */
export const ScreenQueryOptionsSchema = ScreenQueryMatchFilterSchema
    .merge(ScreenQueryMatchSortSchema)
    .transform(
        (values): AggregateQueryOptions => ({
            match: {
                filters: {
                    $match: filterNullishAttributes({
                        _id: values._id,
                        name: values.name && {$regex: values.name, $options: "i"},
                        theatre: values.theatre,
                        capacity: values.capacity,
                        screenType: values.screenType,
                    })
                },
                sorts: {
                    $sort: filterNullishAttributes({
                        name: values.sortByName,
                        capacity: values.sortByCapacity,
                        screenType: values.sortByScreenType,
                        createdAt: values.sortByCreatedAt,
                    })
                }
            }
        })
    );

/**
 * Inferred type representing the final transformed aggregation options.
 */
export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;