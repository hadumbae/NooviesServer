/**
 * @fileoverview Zod schema and inferred type for direct genre field matching from URL parameters.
 */

import {z} from "zod";
import {URLParamStringSchema} from "@/shared/schema/url/URLParamStringSchema";
import {URLParamBooleanSchema} from "@/shared/schema/url/URLParamBooleanSchema";

/** Schema for validating raw filterable URL query fields for genres. */
export const GenreQueryMatchFiltersSchema = z.object({
    name: URLParamStringSchema,
    isFeatured: URLParamBooleanSchema,
});

/** Inferred type for raw genre filter parameters. */
export type GenreQueryMatchFilters = z.infer<typeof GenreQueryMatchFiltersSchema>;