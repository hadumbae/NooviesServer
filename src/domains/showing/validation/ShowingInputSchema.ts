/**
 * @file ShowingInput.schema.ts
 *
 * Zod input schema for creating and updating `Showing` entities.
 *
 * Validates and normalizes incoming payloads by enforcing:
 * - Valid and logically ordered date/time values
 * - Positive ticket pricing
 * - Required ObjectId references
 * - Domain-safe boolean defaults
 * - Valid lifecycle status values
 *
 * Includes a cross-field refinement ensuring the computed
 * end datetime occurs after the computed start datetime
 * when both are provided.
 */

import {z} from "zod";
import {DateTime} from "luxon";
import {ObjectIdStringSchema}
    from "../../../shared/schema/mongoose/ObjectIdStringSchema.js";
import {NonEmptyStringSchema}
    from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {BooleanValueSchema}
    from "../../../shared/schema/booleans/BooleanValueSchema.js";
import {PositiveNumberSchema}
    from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ShowingStatusEnumSchema}
    from "./ShowingStatusEnumSchema.js";
import {SimpleDateStringSchema}
    from "../../../shared/schema/date-time/SimpleDateStringSchema.js";
import {TimeStringSchema}
    from "../../../shared/schema/date-time/TimeStringSchema.js";
import {ShowingConfigInputSchema}
    from "./showing/showing-config/ShowingConfigInputSchema.js";

/**
 * Input schema for showing creation and update operations.
 *
 * @remarks
 * - `endAtDate` and `endAtTime` are optional, but when both are provided
 *   they must resolve to a datetime later than
 *   `startAtDate` + `startAtTime`.
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
            .nonempty({message: "Must not be empty."}),

        /** Marks special screenings (e.g. premieres, festivals). */
        isSpecialEvent: BooleanValueSchema.optional().default(false),

        /** Whether the showing is active and bookable. */
        isActive: BooleanValueSchema.optional().default(true),

        /** Referenced Movie ObjectId. */
        movie: ObjectIdStringSchema,

        /** Referenced Theatre ObjectId. */
        theatre: ObjectIdStringSchema,

        /** Referenced Screen ObjectId. */
        screen: ObjectIdStringSchema,

        /** Showing lifecycle status. */
        status: ShowingStatusEnumSchema,

        /**
         * Optional showing-level configuration overrides.
         *
         * Nullable to allow explicit clearing.
         */
        config: ShowingConfigInputSchema.nullable().optional(),
    })
    .superRefine((values, ctx) => {
        const {startAtDate, startAtTime, endAtDate, endAtTime} = values;

        console.log("Values: ", values);

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
 * Inferred input type for showing create/update operations.
 */
export type ShowingInput = z.infer<typeof ShowingInputSchema>;
