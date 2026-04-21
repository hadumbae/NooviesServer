/**
 * @fileoverview Validation schema for filtering Screen entities in database queries.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";
import {URLParamPositiveNumberSchema} from "@shared/schema/url/URLParamPositiveNumberSchema";
import {ScreenTypeSchema} from "@domains/screen/validation";

/**
 * Zod schema for matching/filtering Screen documents via URL parameters.
 */
export const ScreenQueryMatchFilterSchema = z.object({
    _id: URLParamObjectIDSchema,
    name: URLParamStringSchema,
    theatre: URLParamObjectIDSchema,
    capacity: URLParamPositiveNumberSchema,
    screenType: ScreenTypeSchema.optional(),
});

/**
 * TypeScript type inferred from the ScreenQueryMatchFilterSchema.
 */
export type ScreenQueryMatchFilters = z.infer<typeof ScreenQueryMatchFilterSchema>;