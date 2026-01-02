/**
 * @file ShowingInput.schema.ts
 *
 * Zod schema for creating and updating Showings.
 *
 * Validates and normalizes incoming payloads before persistence by enforcing:
 * - Valid and logically ordered date/time values
 * - Positive pricing
 * - Required ObjectId references
 * - Boolean flags with sensible defaults
 * - Valid lifecycle status values
 *
 * Includes a cross-field refinement to ensure the computed end datetime
 * occurs after the computed start datetime when provided.
 */

import { z } from "zod";
import { DateTime } from "luxon";
import { ObjectIdStringSchema } from "../../../shared/schema/mongoose/ObjectIdStringSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { BooleanValueSchema } from "../../../shared/schema/booleans/BooleanValueSchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ShowingStatusEnumSchema } from "./ShowingStatusEnumSchema.js";
import { SimpleDateStringSchema } from "../../../shared/schema/date-time/SimpleDateStringSchema.js";
import { TimeStringSchema } from "../../../shared/schema/date-time/TimeStringSchema.js";
import { SlugStringSchema } from "../../../shared/schema/strings/SlugStringSchema.js";

/**
 * Input schema for Showing creation and update operations.
 *
 * @remarks
 * - `endAtDate` and `endAtTime` are optional, but when both are provided
 *   they must resolve to a datetime later than `startAtDate` + `startAtTime`.
 * - Boolean flags default to domain-safe values.
 */
export const ShowingInputSchema = z
    .object({
        /** Start date (YYYY-MM-DD). */
        startAtDate: SimpleDateStringSchema,

        /** Start time (HH:mm:ss). */
        startAtTime: TimeStringSchema,

        /** Optional end date (YYYY-MM-DD). */
        endAtDate: SimpleDateStringSchema.optional(),

        /** Optional end time (HH:mm:ss). */
        endAtTime: TimeStringSchema.optional(),

        /** Ticket price; must be greater than zero. */
        ticketPrice: PositiveNumberSchema,

        /** Primary spoken language (ISO-639-1). */
        language: NonEmptyStringSchema,

        /** Subtitle languages (non-empty ISO-639-1 list). */
        subtitleLanguages: z
            .array(NonEmptyStringSchema)
            .nonempty({ message: "Must not be empty." }),

        /** Special event flag. */
        isSpecialEvent: BooleanValueSchema.optional().default(false),

        /** Active / bookable flag. */
        isActive: BooleanValueSchema.optional().default(true),

        /** Referenced Movie ObjectId. */
        movie: ObjectIdStringSchema,

        /** Referenced Theatre ObjectId. */
        theatre: ObjectIdStringSchema,

        /** Referenced Screen ObjectId. */
        screen: ObjectIdStringSchema,

        /** Showing lifecycle status. */
        status: ShowingStatusEnumSchema,

        /** Optional slug (ignored or normalized server-side). */
        slug: SlugStringSchema,
    })
    .superRefine((values, ctx) => {
        const { startAtDate, startAtTime, endAtDate, endAtTime } = values;

        if (endAtDate && endAtTime) {
            const start = DateTime.fromISO(`${startAtDate}T${startAtTime}`);
            const end = DateTime.fromISO(`${endAtDate}T${endAtTime}`);

            if (end < start) {
                const message = "Ending time cannot be earlier than starting time.";

                ctx.addIssue({
                    code: "custom",
                    path: ["endAtDate"],
                    message,
                });

                ctx.addIssue({
                    code: "custom",
                    path: ["endAtTime"],
                    message,
                });
            }
        }
    });

/**
 * Inferred input type for Showing create/update operations.
 */
export type ShowingInput = z.infer<typeof ShowingInputSchema>;
