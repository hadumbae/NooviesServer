/**
 * @fileoverview Transformation schema for Genre query parameters.
 * Orchestrates the conversion of validated URL search parameters into
 * Mongoose-ready $match and $sort aggregation stages.
 */

import {GenreQueryMatchFiltersSchema} from "@domains/genre/validation/query/GenreQueryMatchFiltersSchema";
import {GenreQueryMatchSortsSchema} from "@domains/genre/validation/query/GenreQueryMatchSortsSchema";
import {z} from "zod";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate/optionTypes";

/**
 * Combined Zod schema for Genre query options.
 */
export const GenreQueryOptionsSchema = GenreQueryMatchSortsSchema
    .merge(GenreQueryMatchFiltersSchema)
    .transform(
        (values): AggregateQueryOptions => ({
            match: {
                filters: {
                    $match: filterNullishAttributes({
                        name: values.name && {$regex: values.name, $options: "i"},
                    })
                },

                sorts: {
                    $sort: filterNullishAttributes({
                        name: values.sortByName,
                    })
                },
            }
        })
    );

/**
 * TypeScript type representing the transformed output of the Genre query options.
 */
export type GenreQueryOptions = z.output<typeof GenreQueryOptionsSchema>;