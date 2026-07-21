/**
 * @fileoverview Zod schema and type definitions for validating seat map input data.
 */

import { z } from "zod";
import { SeatAsyncIDString, ShowingAsyncIDString } from "@/shared/schema/helpers/ZodIDHelpers.js";
import { PositiveNumberSchema } from "@/shared/_schema/numbers/numbers/PositiveNumberSchema";
import { SeatMapStatusSchema } from "@/domains/seatmap/_validation/fields/SeatMapStatusSchema";

/** Zod schema for validating the input required to create or update a seat map entry. */
export const SeatMapInputSchema = z.object({
    seat: SeatAsyncIDString,
    showing: ShowingAsyncIDString,
    basePrice: PositiveNumberSchema,
    priceMultiplier: PositiveNumberSchema,
    overridePrice: PositiveNumberSchema.optional(),
    status: SeatMapStatusSchema,
});

/** Type definition inferred from SeatMapInputSchema. */
export type SeatMapInput = z.infer<typeof SeatMapInputSchema>;
