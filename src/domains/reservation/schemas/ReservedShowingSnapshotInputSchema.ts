/**
 * @file ReservedShowingSnapshotInputSchema.ts
 *
 * Zod schema for validating input used to create a reserved showing snapshot.
 *
 * Captures the finalized, authoritative state of a showing at reservation time,
 * including embedded snapshots and financial details.
 */

import { z } from "zod";
import { MovieSnapshotInputSchema } from "../../movie/schema/MovieSnapshotInputSchema.js";
import { TheatreSnapshotInputSchema } from "../../theatre/schema/TheatreSnapshotInputSchema.js";
import { ScreenSnapshotInputSchema } from "../../screen/schema/ScreenSnapshotInputSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { ReservedSeatSnapshotInputSchema } from "../../seatmap/schema/ReservedSeatSnapshotInputSchema.js";
import { ValidDateInstanceSchema } from "../../../shared/schema/date-time/ValidDateInstanceSchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { BooleanValueSchema } from "../../../shared/schema/booleans/BooleanValueSchema.js";
import { ReservationTypeEnumSchema } from "./enum/ReservationTypeEnumSchema.js";
import { ISO6391LanguageCodeSchema } from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";

/**
 * Input validation schema for reserved showing snapshot creation.
 */
export const ReservedShowingSnapshotInputSchema = z.object({
    /** Embedded movie snapshot input. */
    movie: MovieSnapshotInputSchema,

    /** Embedded theatre snapshot input. */
    theatre: TheatreSnapshotInputSchema,

    /** Embedded screen snapshot input. */
    screen: ScreenSnapshotInputSchema,

    /** Selected seat snapshots at reservation time. */
    selectedSeats: generateArraySchema(ReservedSeatSnapshotInputSchema),

    /** Scheduled start time of the showing. */
    startTime: ValidDateInstanceSchema,

    /** Optional scheduled end time. */
    endTime: ValidDateInstanceSchema.optional(),

    /** Primary spoken language (ISO 639-1). */
    language: ISO6391LanguageCodeSchema,

    /** Available subtitle languages (ISO 639-1). */
    subtitleLanguages: z
        .array(ISO6391LanguageCodeSchema)
        .nonempty({ message: "Must not be empty." }),

    /** Indicates whether the showing is a special event. */
    isSpecialEvent: BooleanValueSchema.optional(),

    /** Total price paid for the reservation. */
    pricePaid: PositiveNumberSchema,

    /** Number of tickets included in the reservation. */
    ticketCount: PositiveNumberSchema,

    /** Reservation type applied at booking time. */
    reservationType: ReservationTypeEnumSchema,
});

/** Type representing validated reserved showing snapshot input data. */
export type ReservedShowingSnapshotInputData =
    z.infer<typeof ReservedShowingSnapshotInputSchema>;
