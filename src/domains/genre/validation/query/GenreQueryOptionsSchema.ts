/**
 * @file Aggregated query schema that transforms raw URL params into Mongoose-ready filters and sorts.
 * @filename GenreQueryOptionsSchema.ts
 */

import {GenreQueryMatchFiltersSchema} from "@domains/genre/validation/query/GenreQueryMatchFiltersSchema";
import {GenreQueryMatchSortsSchema} from "@domains/genre/validation/query/GenreQueryMatchSortsSchema";
import {z} from "zod";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Combined schema for Genre query parameters with specialized Mongoose transformations.
 * ---
 */
export const GenreQueryOptionsSchema = GenreQueryMatchSortsSchema
    .merge(GenreQueryMatchFiltersSchema)
    .transform(
        (values) => ({
            /** Mongoose-compatible filter object. */
            filters: filterNullishAttributes({
                name: values.name && {$regex: values.name, $options: "i"},
            }),
            /** Mongoose-compatible sort object. */
            sorts: filterNullishAttributes({
                name: values.sortByName,
            }),
        })
    );

/**
 * TypeScript type representing the transformed output of the Genre query options.
 * ---
 * This is the shape typically passed to repository or service layers.
 */
export type GenreQueryOptions = z.output<typeof GenreQueryOptionsSchema>;