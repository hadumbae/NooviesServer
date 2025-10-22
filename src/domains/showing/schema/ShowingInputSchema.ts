import { z } from "zod";
import { ObjectIdStringSchema } from "../../../shared/schema/strings/ObjectIdStringSchema.js";
import { RequiredStringSchema } from "../../../shared/schema/strings/RequiredStringSchema.js";
import { RequiredBoolean } from "../../../shared/schema/booleans/RequiredBoolean.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ShowingStatusEnumSchema } from "./ShowingStatusEnumSchema.js";
import { SimpleDateStringSchema } from "../../../shared/schema/date-time/SimpleDateStringSchema.js";
import { TimeStringSchema } from "../../../shared/schema/date-time/TimeStringSchema.js";
import { DateTime } from "luxon";

/**
 * @fileoverview
 * Validation schema for creating or updating showings.
 *
 * Ensures all input data is consistent with domain rules before persistence:
 * - Dates and times are valid and logically ordered.
 * - Pricing is positive.
 * - Required strings, booleans, and ObjectIds are enforced.
 * - Status and flags like `isSpecialEvent` and `isActive` are validated.
 *
 * Uses shared schemas to standardize validation across the application:
 * - **Date & Time:** `DateStringSchema`, `TimeStringSchema`
 * - **ObjectId Validation:** `ObjectIdStringSchema`
 * - **Required Fields:** `RequiredStringSchema`, `RequiredBoolean`
 * - **Numeric Values:** `PositiveNumberSchema`
 */

/**
 * Zod schema for showing creation or update input.
 *
 * @remarks
 * - Performs a super refinement to ensure that `endAtDate` + `endAtTime` (if provided) is after `startAtDate` + `startAtTime`.
 * - Returns detailed issues on validation failure.
 *
 * @example
 * ```ts
 * const input = {
 *   startAtDate: "2025-12-01",
 *   startAtTime: "18:00:00",
 *   endAtDate: "2025-12-01",
 *   endAtTime: "20:00:00",
 *   ticketPrice: 12.5,
 *   language: "en",
 *   subtitleLanguages: ["fr", "es"],
 *   movie: "67238c245d6e7e92e5c3219a",
 *   theatre: "67238c245d6e7e92e5c321ab",
 *   screen: "67238c245d6e7e92e5c321cd",
 *   status: "SCHEDULED",
 * };
 *
 * const result = ShowingInputSchema.safeParse(input);
 * if (!result.success) console.error(result.error);
 * ```
 */
export const ShowingInputSchema = z
    .object({
        /** Start date of the showing in ISO format (YYYY-MM-DD). */
        startAtDate: SimpleDateStringSchema,

        /** Start time of the showing in HH:mm:ss format. */
        startAtTime: TimeStringSchema,

        /** Optional end date of the showing in ISO format. */
        endAtDate: SimpleDateStringSchema.optional(),

        /** Optional end time of the showing in HH:mm:ss format. */
        endAtTime: TimeStringSchema.optional(),

        /** Ticket price for the showing; must be greater than zero. */
        ticketPrice: PositiveNumberSchema,

        /** Language code (ISO-639-1) for the showing. */
        language: RequiredStringSchema,

        /** Subtitle languages; must contain at least one valid ISO-639-1 code. */
        subtitleLanguages: z.array(RequiredStringSchema).nonempty({ message: "Must not be empty." }),

        /** Indicates if the showing is a special event. Defaults to `false`. */
        isSpecialEvent: RequiredBoolean.optional().default(false),

        /** Indicates if the showing is active and available for booking. Defaults to `true`. */
        isActive: RequiredBoolean.optional().default(true),

        /** ObjectId referencing the movie. */
        movie: ObjectIdStringSchema,

        /** ObjectId referencing the theatre. */
        theatre: ObjectIdStringSchema,

        /** ObjectId referencing the screen. */
        screen: ObjectIdStringSchema,

        /** Current status of the showing. */
        status: ShowingStatusEnumSchema,
    })
    .superRefine((values, ctx) => {
        const { startAtDate, startAtTime, endAtDate, endAtTime } = values;

        if (endAtDate && endAtTime) {
            const start = DateTime.fromISO(`${startAtDate}T${startAtTime}`);
            const end = DateTime.fromISO(`${endAtDate}T${endAtTime}`);

            if (end < start) {
                const errorMessage = "Ending time cannot be earlier than starting time.";
                ctx.addIssue({ code: "custom", path: ["endAtDate"], message: errorMessage });
                ctx.addIssue({ code: "custom", path: ["endAtTime"], message: errorMessage });
            }
        }
    });

/**
 * TypeScript type inferred from `ShowingInputSchema`.
 */
export type ShowingInput = z.infer<typeof ShowingInputSchema>;
