/**
 * @file Zod input schema for showing create/update operations.
 * @filename ShowingInput.schema.ts
 */

import {z} from "zod";
import {DateTime} from "luxon";
import {ObjectIdStringSchema}
    from "../../../shared/schema/mongoose/ObjectIdStringSchema.js";
import {NonEmptyStringSchema}
    from "../../../shared/schema/strings/NonEmptyStringSchema.js";
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
 * Input schema for showing creation and updates.
 *
 * Ensures end datetime occurs after start datetime when both are provided.
 */
export const ShowingInputSchema = z
    .object({
        startAtDate: SimpleDateStringSchema,
        startAtTime: TimeStringSchema,

        endAtDate: SimpleDateStringSchema.optional(),
        endAtTime: TimeStringSchema.optional(),

        ticketPrice: PositiveNumberSchema,

        language: NonEmptyStringSchema,

        subtitleLanguages: z
            .array(NonEmptyStringSchema)
            .nonempty({message: "Must not be empty."}),

        movie: ObjectIdStringSchema,
        theatre: ObjectIdStringSchema,
        screen: ObjectIdStringSchema,

        status: ShowingStatusEnumSchema,

        /** Nullable to allow explicit clearing. */
        config: ShowingConfigInputSchema,
    })
    .superRefine((values, ctx) => {
        const {startAtDate, startAtTime, endAtDate, endAtTime} = values;

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
 * Input type inferred from {@link ShowingInputSchema}.
 */
export type ShowingInput = z.infer<typeof ShowingInputSchema>;