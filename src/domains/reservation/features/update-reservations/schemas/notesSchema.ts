/**
 * @file Zod schema and type for validating reservation notes input.
 * @filename notesSchema.ts
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";

/**
 * Validation schema for the reservation notes field.
 */
export const ReservationNotesInputSchema = z.object({
    /** Administrative or user-provided remarks regarding the reservation. */
    notes: NonEmptyStringSchema
        .max(3000, "Must be 3000 characters or less.")
        .optional(),
});

/**
 * TypeScript type inferred from {@link ReservationNotesInputSchema}.
 */
export type ReservationNotesInput = z.infer<typeof ReservationNotesInputSchema>;