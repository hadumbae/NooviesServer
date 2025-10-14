import { z } from "zod";
import { CoercedDateSchema } from "../../../shared/schema/date/CoercedDateSchema.js";
import { ObjectIdStringSchema } from "../../../shared/schema/strings/ObjectIdStringSchema.js";
import { RequiredStringSchema } from "../../../shared/schema/strings/RequiredStringSchema.js";
import { RequiredBoolean } from "../../../shared/schema/booleans/RequiredBoolean.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ShowingStatusEnumSchema } from "./ShowingStatusEnumSchema.js";

/**
 * @fileoverview
 * Defines the validation schema for incoming showing creation or update requests.
 *
 * @description
 * This schema ensures that all showing input data conforms to the domain requirements before
 * persistence or mutation. It validates dates, pricing, references, and flags for active
 * and special events, and enforces proper ordering between start and end times.
 *
 * Utilizes shared schema components for standardized validation across the application:
 * - **Date Coercion:** via `CoercedDateSchema`
 * - **ObjectId Validation:** via `ObjectIdStringSchema`
 * - **Required Strings & Booleans:** via `RequiredStringSchema` and `RequiredBoolean`
 * - **Positive Numeric Values:** via `PositiveNumberSchema`
 */

/**
 * Zod schema for validating showing creation and update inputs.
 *
 * @remarks
 * Performs a **super refinement** check to ensure that `endTime` (if provided)
 * is later than `startTime`. If not, a fatal validation issue is raised.
 *
 * @example
 * ```ts
 * const input = {
 *   startTime: "2025-12-01T18:00:00Z",
 *   endTime: "2025-12-01T20:00:00Z",
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
        /** The scheduled start time of the showing. */
        startTime: CoercedDateSchema,

        /** Optional scheduled end time; must be later than `startTime` if provided. */
        endTime: CoercedDateSchema.optional(),

        /** Ticket price for the showing; must be greater than zero. */
        ticketPrice: PositiveNumberSchema,

        /** ISO-639-1 code for the language in which the movie is presented. */
        language: RequiredStringSchema,

        /** Array of subtitle languages; must contain at least one valid ISO-639-1 code. */
        subtitleLanguages: z.array(RequiredStringSchema).nonempty({ message: "Must not be empty." }),

        /** Indicates whether the showing is a special event. Defaults to `false`. */
        isSpecialEvent: RequiredBoolean.optional().default(false),

        /** Indicates whether the showing is active and available for booking. Defaults to `true`. */
        isActive: RequiredBoolean.optional().default(true),

        /** The ObjectId string referencing the associated movie. */
        movie: ObjectIdStringSchema,

        /** The ObjectId string referencing the theatre where the showing takes place. */
        theatre: ObjectIdStringSchema,

        /** The ObjectId string referencing the screen on which the movie is shown. */
        screen: ObjectIdStringSchema,

        /** The current status of the showing (e.g., `SCHEDULED`, `RUNNING`, `COMPLETED`). */
        status: ShowingStatusEnumSchema,
    })
    .superRefine((values, ctx) => {
        const { startTime, endTime } = values;

        if (endTime && startTime >= endTime) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                fatal: true,
                message: "Ending time cannot be earlier than starting time.",
            });

            return z.NEVER;
        }
    });
