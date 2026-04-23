/**
 * @fileoverview Validation schema and type definitions for theatre input data.
 */

import { z } from "zod";
import { NonEmptyStringSchema } from "@shared/schema/strings/NonEmptyStringSchema";
import { NonNegativeNumberSchema } from "@shared/schema/numbers/NonNegativeNumberSchema";
import { LocationSchema } from "@shared/schema/theatre/Location.schema";

/**
 * Zod validation schema for creating or updating a theatre.
 * Enforces constraints on name length, non-negative capacity, and geographic location data.
 */
export const TheatreInputSchema = z.object({
    name: NonEmptyStringSchema.max(255, "Must be 255 characters or less."),
    seatCapacity: NonNegativeNumberSchema,
    location: LocationSchema,
});

/**
 * Type definition for theatre input data, inferred from the validation schema.
 */
export type TheatreInputData = z.infer<typeof TheatreInputSchema>;