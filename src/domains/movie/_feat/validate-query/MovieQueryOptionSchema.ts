/**
 * @fileoverview Transformation logic for Movie query options.
 * Consolidates filters and sorts into a structured Mongoose aggregation pipeline configuration.
 */

import {z} from "zod";
import {MovieQueryFiltersSchema} from "./MovieQueryFiltersSchema";
import {MovieQuerySortsSchema} from "./MovieQuerySortsSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for Movie query options with an aggregation transformation.
 */
export const MovieQueryOptionsSchema = MovieQuerySortsSchema
    .merge(MovieQueryFiltersSchema)
    .transform(
        (values): AggregateQueryOptions => ({
            match: {
                filters: {
                    $match: filterNullishAttributes({
                        _id: values._id,
                        title: values.title,
                        releaseDate: values.releaseDate,
                        genres: values.genres,
                        originalTitle: values.originalTitle,
                        isReleased: values.isReleased,
                        country: values.country,
                        isAvailable: values.isAvailable,
                    }),
                },
                sorts: {
                    $sort: filterNullishAttributes({
                        releaseDate: values.sortByReleaseDate,
                        title: values.sortByTitle,
                        originalTitle: values.sortByOriginalTitle,
                        isReleased: values.sortByIsReleased,
                        isAvailable: values.sortByIsAvailable,
                        country: values.sortByCountry,
                    }),
                },
            }
        })
    );

/**
 * TypeScript type inferred from the transformed MovieQueryOptionsSchema.
 */
export type MovieQueryOptions = z.infer<typeof MovieQueryOptionsSchema>;