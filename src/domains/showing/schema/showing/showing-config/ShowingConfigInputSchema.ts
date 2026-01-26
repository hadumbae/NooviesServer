/**
 * @file ShowingConfigInputSchema.ts
 *
 * Zod input schema for showing-level configuration updates.
 *
 * Used to validate partial configuration payloads supplied
 * by admin or internal mutation flows.
 */

import {z} from "zod";
import {BooleanValueSchema}
    from "../../../../../shared/schema/booleans/BooleanValueSchema.js";

/**
 * Showing configuration input schema.
 *
 * All fields are optional and nullable to support
 * partial updates and patch-style mutations.
 */
export const ShowingConfigInputSchema = z.object({
    /** Whether seat reservations are allowed for the showing */
    canReserveSeats: BooleanValueSchema.nullable().optional(),
});

/**
 * Inferred input type for showing configuration updates.
 */
export type ShowingConfigInput = z.infer<typeof ShowingConfigInputSchema>;
