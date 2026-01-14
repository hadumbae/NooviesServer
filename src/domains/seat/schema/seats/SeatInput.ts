/**
 * @file SeatInput.ts
 *
 * Zod schemas for validating Seat creation and updates.
 */


import {z} from 'zod';
import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {NonEmptyStringSchema} from "../../../../shared/schema/strings/NonEmptyStringSchema.js";
import {BooleanValueSchema} from "../../../../shared/schema/booleans/BooleanValueSchema.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import {ObjectIdStringSchema} from "../../../../shared/schema/mongoose/ObjectIdStringSchema.js";
import {SeatLayoutTypeEnum} from "../enum/SeatLayoutTypeEnum.js";

/**
 * ## SeatInputBaseSchema
 *
 * Base Zod schema for all seat inputs.
 * Contains properties common to both seating and non-seating layout types.
 *
 * @properties
 * - `theatre` — ObjectId string referencing the theatre.
 * - `screen` — ObjectId string referencing the screen.
 * - `row` — Row identifier (max 10 characters).
 * - `x` — X-coordinate in the seating layout (positive number).
 * - `y` — Y-coordinate in the seating layout (positive number).
 * - `layoutType` — Layout classification (SEAT, AISLE, STAIR).
 */
export const SeatInputBaseSchema = z.object({
    theatre: ObjectIdStringSchema,
    screen: ObjectIdStringSchema,
    row: NonEmptyStringSchema.max(10, "Must be 10 characters or less."),
    x: PositiveNumberSchema,
    y: PositiveNumberSchema,
    layoutType: SeatLayoutTypeEnum,
});

/**
 * ## SeatInputAisleSchema
 *
 * Schema for an AISLE in the theatre layout.
 * Extends the base schema and restricts `layoutType` to "AISLE".
 */
export const SeatInputAisleSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("AISLE"),
});

/**
 * ## SeatInputStairSchema
 *
 * Schema for a STAIR in the theatre layout.
 * Extends the base schema and restricts `layoutType` to "STAIR".
 */
export const SeatInputStairSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("STAIR"),
});

/**
 * ## SeatInputSeatingSchema
 *
 * Schema for actual seating positions (SEAT layout type).
 * Extends the base schema and includes additional seat-specific properties:
 * - `seatType` — Type/category of seat (e.g., VIP, REGULAR).
 * - `seatNumber` — Numeric identifier within the row.
 * - `seatLabel` — Optional display label (max 50 characters).
 * - `isAvailable` — Boolean indicating booking availability.
 * - `priceMultiplier` — Multiplier applied to the base ticket price.
 */
export const SeatInputSeatingSchema = SeatInputBaseSchema.extend({
    layoutType: z.literal("SEAT"),
    seatType: SeatTypeEnum,
    seatNumber: NonNegativeNumberSchema,
    seatLabel: NonEmptyStringSchema.max(50, "Must be 50 characters or less").optional(),
    isAvailable: BooleanValueSchema,
    priceMultiplier: NonNegativeNumberSchema,
});

/**
 * ## SeatInputSchema
 *
 * Discriminated union schema for seat input validation.
 * Differentiates between seating and non-seating layout types based on `layoutType`.
 *
 * @example
 * ```ts
 * // Seating input
 * const seatInput = SeatInputSchema.parse({
 *   theatre: "64f1c0c8ab1234567890abcd",
 *   screen: "64f1c0c8ab1234567890abce",
 *   row: "A",
 *   seatNumber: 1,
 *   seatType: "VIP",
 *   layoutType: "SEAT",
 *   x: 1,
 *   y: 1,
 *   seatLabel: "VIP-1",
 *   isAvailable: true,
 *   priceMultiplier: 1.5,
 * });
 *
 * // Aisle input
 * const aisleInput = SeatInputSchema.parse({
 *   theatre: "64f1c0c8ab1234567890abcd",
 *   screen: "64f1c0c8ab1234567890abce",
 *   row: "B",
 *   layoutType: "AISLE",
 *   x: 5,
 *   y: 1,
 * });
 *
 * // Stair input
 * const stairInput = SeatInputSchema.parse({
 *   theatre: "64f1c0c8ab1234567890abcd",
 *   screen: "64f1c0c8ab1234567890abce",
 *   row: "C",
 *   layoutType: "STAIR",
 *   x: 10,
 *   y: 2,
 * });
 * ```
 */
export const SeatInputSchema = z.discriminatedUnion("layoutType", [
    SeatInputAisleSchema,
    SeatInputStairSchema,
    SeatInputSeatingSchema,
]);