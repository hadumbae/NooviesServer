/**
 * @fileoverview Validation schema for reference-based filtering of Seat entities.
 * These filters resolve relationships through associated Showing, Theatre, and Screen entities.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";

/**
 * Zod schema defining reference filters for Seat queries.
 */
export const SeatQueryReferenceFilterSchema = z.object({
    showing: URLParamObjectIDSchema,
    showingSlug: URLParamObjectIDSchema,
    theatreSlug: URLParamStringSchema,
    screenSlug: URLParamStringSchema,
});

/**
 * TypeScript type inferred from SeatQueryReferenceFilterSchema.
 */
export type SeatQueryReferenceFilters = z.infer<typeof SeatQueryReferenceFilterSchema>;