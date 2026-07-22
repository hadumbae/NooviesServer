/**
 * @fileoverview Defines the Zod schema and type for validating showing configuration input.
 */

import {z} from "zod";
import {BooleanValueSchema}
    from "@/shared/_schema/booleans/BooleanValueSchema.js";

/** Zod schema for validating showing configuration settings. */
export const ShowingConfigInputSchema = z.object({
    canReserveSeats: BooleanValueSchema.nullable().optional(),
    isSpecialEvent: BooleanValueSchema.nullable().optional(),
    isActive: BooleanValueSchema,
});

/** Type definition for showing configuration input derived from the Zod schema. */
export type ShowingConfigInput = z.infer<typeof ShowingConfigInputSchema>;
