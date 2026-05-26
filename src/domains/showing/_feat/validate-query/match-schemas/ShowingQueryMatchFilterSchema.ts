/**
 * @fileoverview Validation schema for direct attribute filtering of Showing entities.
 * Targets specific showtime properties persisted on the Showing document.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamPositiveNumberSchema} from "@shared/schema/url/URLParamPositiveNumberSchema";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {ShowingStatusEnumSchema} from "@domains/showing/validation/ShowingStatusEnumSchema";

/**
 * Zod schema defining match-level filters for Showing queries.
 */
export const ShowingQueryMatchFilterSchema = z.object({
    movie: URLParamObjectIDSchema,
    theatre: URLParamObjectIDSchema,
    screen: URLParamObjectIDSchema,
    ticketPrice: URLParamPositiveNumberSchema,
    isSpecialEvent: URLParamBooleanSchema,
    isActive: URLParamBooleanSchema,
    status: ShowingStatusEnumSchema.optional(),
});

/**
 * TypeScript type inferred from ShowingQueryMatchFilterSchema.
 */
export type ShowingQueryMatchFilters = z.infer<typeof ShowingQueryMatchFilterSchema>;