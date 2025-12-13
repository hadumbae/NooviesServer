import { z } from "zod";
import { SeatAsyncIDString, ShowingAsyncIDString } from "../../../shared/schema/helpers/ZodIDHelpers.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { SeatMapStatusEnumSchema } from "./enum/SeatMapStatusEnumSchema.js";

/**
 * @summary
 * Zod schema for validating input when creating or updating a `SeatMap`.
 *
 * Ensures:
 * - `seat` is a valid async seat ID.
 * - `showing` is a valid async showing ID.
 * - `basePrice` and `priceMultiplier` are positive numbers.
 * - `overridePrice` is optional and positive if provided.
 * - `status` is a valid `SeatMap` status.
 *
 * @example
 * const input = {
 *   seat: "64f7b1c9d2a4b2f3a1c2e456",
 *   showing: "64f7b1c9d2a4b2f3a1c2e789",
 *   basePrice: 100,
 *   priceMultiplier: 1.5,
 *   overridePrice: 150,
 *   status: "AVAILABLE"
 * };
 *
 * const parsed = SeatMapInputSchema.parse(input);
 */
export const SeatMapInputSchema = z.object({
    /** The seat ID being mapped. */
    seat: SeatAsyncIDString,

    /** The showing ID associated with this seat map. */
    showing: ShowingAsyncIDString,

    /** Base price for the seat. */
    basePrice: PositiveNumberSchema,

    /** Price multiplier for the seat. */
    priceMultiplier: PositiveNumberSchema,

    /** Optional override price. */
    overridePrice: PositiveNumberSchema.optional(),

    /** Current status of the seat. */
    status: SeatMapStatusEnumSchema,
});

/**
 * @summary
 * Type representing valid input for creating/updating a `SeatMap`.
 *
 * Inferred from {@link SeatMapInputSchema}.
 */
export type SeatMapInput = z.infer<typeof SeatMapInputSchema>;
