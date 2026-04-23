/**
 * @fileoverview Validation schema for direct attribute filtering of Seat entities.
 * These filters target properties persisted directly on the Seat document.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamPositiveNumberSchema} from "@shared/schema/url/URLParamPositiveNumberSchema";
import {SeatTypeEnum} from "../../schema/SeatTypeEnum";
import {SeatLayoutTypeEnum} from "../../schema/SeatLayoutTypeEnum";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {URLParamNonNegativeNumberSchema} from "@shared/schema/url/URLParamNonNegativeNumberSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining match-level filters for Seat queries.
 */
export const SeatQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    row: URLParamRegexPatternSchema,
    seatNumber: URLParamPositiveNumberSchema,
    seatLabel: URLParamRegexPatternSchema,
    seatType: SeatTypeEnum.optional(),
    layoutType: SeatLayoutTypeEnum.optional(),
    isAvailable: URLParamBooleanSchema,
    theatre: URLParamObjectIDSchema,
    screen: URLParamObjectIDSchema,
    priceMultiplier: URLParamNonNegativeNumberSchema,
});

/**
 * TypeScript type inferred from SeatQueryMatchFiltersSchema.
 */
export type SeatQueryMatchFilters = z.infer<typeof SeatQueryMatchFiltersSchema>;