import {z, type ZodType} from "zod";
import {IDInstance} from "../../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../../theatre/schema/TheatreSchema.js";
import {SeatSchema} from "../../../seat/schema/SeatSchema.js";
import type {IScreen} from "../../interface/IScreen.js";
import {ScreenTypeEnum} from "../enum/ScreenTypeEnum.js";
import {ShowingSchema} from "../../../showing/schema/ShowingSchema.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {RequiredStringSchema} from "../../../../shared/schema/strings/RequiredStringSchema.js";
import type {IScreenDetails} from "../../interface/IScreenDetails.js";

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
    theatre: z.union([IDInstance, z.lazy(() => TheatreSchema)]),
});

/**
 * Extended schema that includes full screen details, including a populated
 * theatre object, associated seats, and scheduled showings.
 */
export const ScreenDetailsRawSchema = ScreenBaseRawSchema.extend({
    /** Fully populated theatre object this screen belongs to */
    theatre: z.lazy(() => TheatreSchema),

    /** Array of seat objects in this screen */
    seats: z.array(
        z.lazy(() => SeatSchema),
        { required_error: "Required.", invalid_type_error: "Must be an array." },
    ),

    /** Array of showings (movie sessions) scheduled for this screen */
    showings: z.array(
        z.lazy(() => ShowingSchema),
        { required_error: "Required.", invalid_type_error: "Must be an array." },
    ),
});

/**
 * Zod schema for validating `IScreen` objects using base screen structure.
 */
export const ScreenSchema = ScreenBaseRawSchema as ZodType<IScreen>;

/**
 * Zod schema for validating `IScreenDetails` objects that include
 * full theatre, seat, and showing data.
 */
export const ScreenDetailsSchema = ScreenDetailsRawSchema as ZodType<IScreenDetails>;

