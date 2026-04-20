/**
 * @fileoverview Validation schema for sorting Screen entities in database queries.
 */

import {z} from "zod";
import {
    MongooseNumericSortSchema,
} from "@shared/schema/url/URLParamMongooseSortOrderSchema";

/**
 * Zod schema for defining sort criteria in Screen queries.
 */
export const ScreenQueryMatchSortSchema = z.object({
    sortByName: MongooseNumericSortSchema.optional(),
    sortByCapacity: MongooseNumericSortSchema.optional(),
    sortByScreenType: MongooseNumericSortSchema.optional(),
    sortByCreatedAt: MongooseNumericSortSchema.optional(),
});

/**
 * TypeScript type inferred from ScreenQueryMatchSortSchema.
 */
export type ScreenQueryMatchSorts = z.infer<typeof ScreenQueryMatchSortSchema>;