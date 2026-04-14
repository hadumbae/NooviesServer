/**
 * @fileoverview Validation schema and types for Person query sorting.
 */

import {z} from "zod";
import {MongooseNumericSortSchema} from "@shared/schema/url/URLParamMongooseSortOrderSchema";

/**
 * Validates available sort fields for Person results.
 */
export const PersonQueryMatchSortsSchema = z.object({
    /** Sort order by name (1 for asc, -1 for desc). */
    sortByName: MongooseNumericSortSchema.optional(),

    /** Sort order by date of birth. */
    sortByDOB: MongooseNumericSortSchema.optional(),

    /** Sort order by nationality code. */
    sortByNationality: MongooseNumericSortSchema.optional(),
});

/**
 * Type representing validated sorting options for Person document queries.
 */
export type PersonQueryMatchSorts = z.infer<typeof PersonQueryMatchSortsSchema>;