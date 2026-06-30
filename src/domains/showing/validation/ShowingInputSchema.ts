/**
 * @file Zod input schema for showing create/update operations.
 * @filename ShowingInput.schema.ts
 */

import {z} from "zod";
import {DateTime} from "luxon";
import {ObjectIdStringSchema} from "@/shared/schema/mongoose/ObjectIdStringSchema";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {PositiveNumberSchema} from "@/shared/schema/numbers/PositiveNumberSchema";
import {ShowingStatusEnumSchema} from "./ShowingStatusEnumSchema.js";
import {SimpleDateStringSchema} from "@/shared/schema/date-time/SimpleDateStringSchema";
import {TimeStringSchema} from "@/shared/schema/date-time/TimeStringSchema";
import {ShowingConfigInputSchema} from "./showing/showing-config/ShowingConfigInputSchema.js";
import {IANATimezoneSchema} from "@/shared/schema/date-time/IANATimezoneSchema";

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
        localTimezone: IANATimezoneSchema,

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
    }).transform(({startAtTime, startAtDate, endAtTime, endAtDate, localTimezone, ...values}) => {
        const startTime = DateTime
            .fromISO(`${startAtDate}T${startAtTime}`, {zone: localTimezone})
            .toUTC()
            .toJSDate();

        const endTime = (endAtDate && endAtTime)
            ? DateTime.fromISO(`${endAtDate}T${endAtTime}`, {zone: localTimezone}).toUTC().toJSDate()
            : null;

        return {
            ...values,
            startTime,
            endTime,
        }
    });

/**
 * Input type inferred from {@link ShowingInputSchema}.
 */
export type ShowingInput = z.infer<typeof ShowingInputSchema>;