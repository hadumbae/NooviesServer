import {z, type ZodType} from "zod";
import {IDInstance} from "../../../../shared/schema/helpers/ZodInstanceHelpers.js";
import type {IScreen} from "../../interface/IScreen.js";
import {ScreenTypeEnum} from "../enum/ScreenTypeEnum.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {RequiredStringSchema} from "../../../../shared/schema/strings/RequiredStringSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";

/**
 * Base schema for a screen object, defining its core properties such as ID,
 * name, seating capacity, screen type, and associated theatre reference.
 */
export const ScreenBaseRawSchema = z.object({
    /** Unique identifier for the screen (MongoDB ObjectId instance) */
    _id: IDInstance,

    /** Screen name; required string, up to 255 characters */
    name: RequiredStringSchema.min(1, "Required.").max(255, "Name must be 255 characters or less."),

    /** Total seating capacity of the screen; must be a positive number > 0 */
    capacity: PositiveNumberSchema.gt(0, "Capacity must be greater than 0"),

    /** Enum value indicating the type of screen (e.g., standard, IMAX, 3D) */
    screenType: ScreenTypeEnum,

    /**
     * Reference to the theatre the screen belongs to.
     * Can be an ObjectId or a fully populated Theatre object.
     */
    theatre: IDInstance,
});

/**
 * Extended schema for a screen that includes detailed information
 * such as the full theatre object, total seat count, and future showing count.
 *
 * This schema is typically used for enriched API responses or admin views.
 */
export const ScreenDetailsSchema = ScreenBaseRawSchema.extend({
    /** Fully populated theatre object that the screen belongs to. */
    theatre: IDInstance,

    /** Total number of seats in the screen. */
    seatCount: NonNegativeNumberSchema,

    /** Number of showings scheduled in the future for this screen. */
    futureShowingCount: NonNegativeNumberSchema,
});

/**
 * Zod schema for validating `IScreen` objects using base screen structure.
 */
export const ScreenSchema = ScreenBaseRawSchema as ZodType<IScreen>;

