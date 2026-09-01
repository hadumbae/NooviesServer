/**
 * @fileoverview Zod schema and inferred type for genre sorting option parameters.
 */

import {z} from "zod";
import {
    MongooseNumericSortSchema,
} from "@/shared/schema/url/URLParamMongooseSortOrderSchema";

/** Schema for validating sort key parameters for genre queries. */
export const GenreQueryMatchSortsSchema = z.object({
    sortByName: MongooseNumericSortSchema.optional(),
});

/** Inferred type for genre query sort options. */
export type GenreQueryMatchSorts = z.infer<typeof GenreQueryMatchSortsSchema>;