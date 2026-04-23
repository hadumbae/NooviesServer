/**
 * @fileoverview Zod validation schemas for theatre seating layouts.
 * Supports different layout types including seats, aisles, and stairs.
 */

import { z } from 'zod';
import { NonEmptyStringSchema } from "@shared/schema/strings/NonEmptyStringSchema";
import { BooleanValueSchema } from "@shared/schema/booleans/BooleanValueSchema";
import { PositiveNumberSchema } from "@shared/schema/numbers/PositiveNumberSchema";
import { NonNegativeNumberSchema } from "@shared/schema/numbers/NonNegativeNumberSchema";
import { ObjectIdStringSchema } from "@shared/schema/mongoose/ObjectIdStringSchema";
import { SeatLayoutTypeSchema } from "@domains/seat/validation/SeatLayoutTypeSchema";
import {SeatTypeSchema} from "domains/seat/validation";

/**
 * Common properties shared across all grid elements in a theatre screen layout.
 */
export const SeatInputBaseSchema = z.object({
    theatre: ObjectIdStringSchema,
    screen: ObjectIdStringSchema,
    row: NonEmptyStringSchema.max(10, "Must be 10 characters or less."),
    x: PositiveNumberSchema,
    y: PositiveNumberSchema,
    layoutType: SeatLayoutTypeSchema,
});

/**
 * Validation for layout grid elements designated as walkway aisles.
 */
export const SeatInputAisleSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("AISLE"),
});

/**
 * Validation for layout grid elements designated as stairs.
 */
export const SeatInputStairSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("STAIR"),
});

/**
 * Validation for functional seats, including pricing and availability data.
 */
export const SeatInputSeatingSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("SEAT"),
    seatType: SeatTypeSchema,
    seatNumber: NonNegativeNumberSchema,
    seatLabel: NonEmptyStringSchema.max(50, "Must be 50 characters or less").optional(),
    isAvailable: BooleanValueSchema,
    priceMultiplier: NonNegativeNumberSchema,
});

/**
 * Discriminated union schema that routes validation logic based on the `layoutType` field.
 */
export const SeatInputSchema = z.discriminatedUnion("layoutType", [
    SeatInputAisleSchema,
    SeatInputStairSchema,
    SeatInputSeatingSchema,
]);

/**
 * Type definition for seat and layout input data, inferred from the union schema.
 */
export type SeatInputData = z.infer<typeof SeatInputSchema>;