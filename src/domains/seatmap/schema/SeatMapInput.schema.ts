import { z } from "zod";
import { SeatAsyncIDString, ShowingAsyncIDString } from "../../../shared/schema/helpers/ZodIDHelpers.js";
import { NumberValueSchema } from "../../../shared/schema/numbers/NumberValueSchema.js";
import { SeatMapStatusEnumSchema } from "./enum/SeatMapStatusEnumSchema.js";

/**
 * Zod schema for validating input data when creating or updating a `SeatMap`.
 *
 * Ensures that:
 * - `seat` references a valid asynchronous seat ID.
 * - `showing` references a valid asynchronous showing ID.
 * - `price`, if provided, is a number greater than 0.
 * - `status` is a valid `SeatMap` status.
 *
 * @example
 * ```ts
 * import { SeatMapInputSchema } from './SeatMapInput.schema';
 *
 * const input = {
 *   seat: "64f7b1c9d2a4b2f3a1c2e456",
 *   showing: "64f7b1c9d2a4b2f3a1c2e789",
 *   price: 150,
 *   status: "AVAILABLE"
 * };
 *
 * const parsed = SeatMapInputSchema.parse(input);
 * ```
 */
export const SeatMapInputSchema = z.object({
    /** The ID of the seat being mapped. */
    seat: SeatAsyncIDString,

    /** The ID of the showing associated with this seat map. */
    showing: ShowingAsyncIDString,

    /** Optional price of the seat. Must be greater than 0 if provided. */
    price: NumberValueSchema.gt(0, "Must be greater than 0.").optional(),

    /** Current status of the seat in the seat map. */
    status: SeatMapStatusEnumSchema,
});

/**
 * TypeScript type inferred from `SeatMapInputSchema`.
 *
 * Represents the valid input object for creating or updating a `SeatMap`.
 */
export type SeatMapInput = z.infer<typeof SeatMapInputSchema>;
