import {z} from 'zod';
import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {RequiredStringSchema} from "../../../../shared/schema/strings/RequiredStringSchema.js";
import {BooleanValueSchema} from "../../../../shared/schema/booleans/BooleanValueSchema.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import {ObjectIdStringSchema} from "../../../../shared/schema/mongoose/ObjectIdStringSchema.js";

/**
 * 🎯 Base input fields for creating or updating a seat.
 * Contains IDs, availability status, and price multiplier.
 */
export const SeatInputBaseSchema = z.object({
    /** ID of the theatre this seat belongs to, as a MongoDB ObjectId string. */
    theatre: ObjectIdStringSchema,

    /** ID of the screen this seat belongs to, as a MongoDB ObjectId string. */
    screen: ObjectIdStringSchema,

    /** Type of seat (e.g., standard, VIP, couple). */
    seatType: SeatTypeEnum,

    /** Availability status of the seat: `true` if bookable, otherwise `false`. */
    isAvailable: BooleanValueSchema,

    /** Non-negative multiplier applied to a base ticket price (e.g., 1.0, 1.5). */
    priceMultiplier: NonNegativeNumberSchema,
});

/**
 * 🪑 Input schema for individual seat creation or update.
 * Extends `SeatInputBaseSchema` with placement and labeling fields.
 */
export const SeatInputSchema = SeatInputBaseSchema.extend({
    /** Row label (e.g., "A", "B", up to 10 characters). */
    row: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    /** Seat number within the row (0 or greater). */
    seatNumber: NonNegativeNumberSchema,

    /** Optional display label (e.g., "A5", "VIP‑3", max 50 chars). */
    seatLabel: RequiredStringSchema.max(50, "Must be 50 characters or less").optional(),

    /** X-coordinate for seating layout visualizations. */
    x: PositiveNumberSchema,

    /** Y-coordinate for seating layout visualizations. */
    y: PositiveNumberSchema,
});

/**
 * 📋 Input schema for submitting multiple seats in a given row.
 * Useful when adding seats en masse (e.g., "10 seats in row C").
 */
export const SeatsByRowInputSchema = SeatInputBaseSchema.extend({
    /** Row label for the batch of seats (up to 10 characters). */
    row: RequiredStringSchema.max(10, "Must be 10 characters or less."),

    /** Optional Y-coordinate for the row, for layout rendering. */
    y: PositiveNumberSchema.optional(),

    /** Number of seats to create in the specified row (must be ≥ 1). */
    numberOfSeats: PositiveNumberSchema,
});
