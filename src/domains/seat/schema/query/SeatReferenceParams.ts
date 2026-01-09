/**
 * @file SeatReferenceParams.ts
 *
 * Zod schema defining reference-based filters for Seat queries.
 *
 * These filters are resolved through related entities
 * (showing, theatre, screen) rather than fields stored
 * directly on the Seat document.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Reference-based filters applied to Seat queries.
 */
export const SeatQueryReferenceFilterSchema = z.object({
    /** Related showing ObjectId */
    showing: URLParamObjectIDSchema,

    /** Related showing slug */
    showingSlug: URLParamObjectIDSchema,

    /** Theatre identifier (slug) */
    theatreSlug: URLParamStringSchema,

    /** Screen identifier (slug) */
    screenSlug: URLParamStringSchema,
});

/**
 * Inferred type for seat reference filters.
 */
export type SeatQueryReferenceFilters =
    z.infer<typeof SeatQueryReferenceFilterSchema>;
