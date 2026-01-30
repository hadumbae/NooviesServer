/**
 * @file ReservedShowingSnapshotInputSchema.ts
 *
 * @description
 * Zod schema for validating input when creating a reserved showing snapshot.
 *
 * Captures the finalized state of a showing at reservation time, including
 * embedded snapshots of the movie, theatre, screen, selected seats, language,
 * subtitles, special event flag, and price paid. Ensures historical and
 * financial integrity for reservations and related records.
 */

import { z } from "zod";
import { MovieSnapshotInputSchema } from "../../movie/schema/MovieSnapshotInputSchema.js";
import { TheatreSnapshotInputSchema } from "../../theatre/schema/TheatreSnapshotInputSchema.js";
import { ScreenSnapshotInputSchema } from "../../screen/schema/ScreenSnapshotInputSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { ReservedSeatSnapshotInputSchema } from "../../seatmap/schema/ReservedSeatSnapshotInputSchema.js";
import { ValidDateInstanceSchema } from "../../../shared/schema/date-time/ValidDateInstanceSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { BooleanValueSchema } from "../../../shared/schema/booleans/BooleanValueSchema.js";

/** Reserved showing snapshot input schema. */
export const ReservedShowingSnapshotInputSchema = z.object({
    /** Embedded movie snapshot input. */
    movie: MovieSnapshotInputSchema,

    /** Embedded theatre snapshot input. */
    theatre: TheatreSnapshotInputSchema,

    /** Embedded screen snapshot input. */
    screen: ScreenSnapshotInputSchema,

    /** Array of selected seat snapshots at reservation time. */
    selectedSeats: generateArraySchema(ReservedSeatSnapshotInputSchema),

    /** Scheduled start time of the showing. */
    startTime: ValidDateInstanceSchema,

    /** Optional end time of the showing; must be later than startTime if present. */
    endTime: ValidDateInstanceSchema.optional(),

    /** Primary spoken language of the showing (ISO-639-1). */
    language: NonEmptyStringSchema,

    /** Subtitle languages available for the showing (ISO-639-1). Must not be empty. */
    subtitleLanguages: z.array(NonEmptyStringSchema).nonempty({ message: "Must not be empty." }),

    /** Optional flag indicating whether the showing is a special event. */
    isSpecialEvent: BooleanValueSchema.optional(),

    /** Total price paid for the reserved showing. */
    pricePaid: PositiveNumberSchema,
});

/** Type representing the input data for creating a reserved showing snapshot. */
export type ReservedShowingSnapshotInputData = z.infer<typeof ReservedShowingSnapshotInputSchema>;
