/**
 * @file Zod schema for defining genre-specific sorting logic from URL parameters.
 * @filename GenreQueryMatchSortsSchema.ts
 */

import {z} from "zod";
import {
    MongooseNumericSortSchema,
} from "@shared/schema/url/URLParamMongooseSortOrderSchema";

/**
 * Validates the available sort keys for Genre queries.
 * ---
 */
export const GenreQueryMatchSortsSchema = z.object({
    /** Sort order for the genre name field. */
    sortByName: MongooseNumericSortSchema.optional(),
});

/** Inferred TypeScript type for genre sort parameters. */
export type GenreQueryMatchSorts = z.infer<typeof GenreQueryMatchSortsSchema>;