import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../../theatre/schema/TheatreSchema.js";
import type ISeat from "../../model/ISeat.js";
import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {ScreenSchema} from "../../../screen/schema/screen/Screen.schema.js";
import {CoercedNumberSchema} from "../../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredStringSchema} from "../../../../shared/schema/strings/RequiredStringSchema.js";
import {RequiredBoolean} from "../../../../shared/schema/booleans/RequiredBoolean.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import type ISeatDetails from "../../model/ISeatDetails.js";

/**
 * Base schema for a seat object.
 * Includes common fields shared across all seat types.
 */
export const SeatBaseSchema = z.object({
    /** Unique MongoDB ObjectId of the seat. */
    _id: IDInstance,

    /** Row label the seat is in (e.g., "A", "B"). */
    row: RequiredStringSchema.min(1, "Required.").max(10, "Must be 10 characters or less."),

    /** Number within the row (e.g., 1, 5, 12). */
    seatNumber: NonNegativeNumberSchema,

    /** Optional display label for the seat (e.g., "A5", "VIP-3"). */
    seatLabel: RequiredStringSchema.max(50, "Must be 50 characters or less").optional(),

    /** Type of seat (e.g., standard, VIP, couple). */
    seatType: SeatTypeEnum,

    /** Whether the seat is currently available for booking. */
    isAvailable: RequiredBoolean,

    /** Multiplier applied to the base price for this seat. */
    priceMultiplier: CoercedNumberSchema.gte(0, "Must be 0 or greater."),

    /** Optional X coordinate for layout rendering. */
    x: PositiveNumberSchema.optional(),

    /** Optional Y coordinate for layout rendering. */
    y: PositiveNumberSchema.optional(),
});

/**
 * Schema for a raw seat, referencing screen and theatre either by ID or populated object.
 */
export const SeatRawSchema = SeatBaseSchema.extend({
    /** The theatre the seat belongs to (ID or full object). */
    theatre: z.union([IDInstance, z.lazy(() => TheatreSchema)]),

    /** The screen the seat belongs to (ID or full object). */
    screen: z.union([IDInstance, z.lazy(() => ScreenSchema)]),
});

/**
 * Schema for a seat with full screen and theatre population.
 * Functionally similar to SeatRawSchema, intended for populated use cases.
 */
export const SeatDetailsRawSchema = SeatBaseSchema.extend({
    /** Fully populated theatre object (or ID). */
    theatre: z.union([IDInstance, z.lazy(() => TheatreSchema)]),

    /** Fully populated screen object (or ID). */
    screen: z.union([IDInstance, z.lazy(() => ScreenSchema)]),
});

/**
 * Final Zod schema for a seat object, typed with ISeat interface.
 */
export const SeatSchema = SeatRawSchema as ZodType<ISeat>;

/**
 * Final Zod schema for a fully populated seat object, typed with ISeatDetails interface.
 */
export const SeatDetailsSchema = SeatDetailsRawSchema as ZodType<ISeatDetails>;