/**
 * @fileoverview Zod schema and type for validating reservation notes input.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";

/**
 * Validation schema for the reservation notes field.
 */
export const ReservationNotesInputSchema = z.object({
    notes: NonEmptyStringSchema
        .max(3000, "Must be 3000 characters or less.")
        .optional(),
});

/** TypeScript type inferred from ReservationNotesInputSchema. */
export type ReservationNotesInput = z.infer<typeof ReservationNotesInputSchema>;