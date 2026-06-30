/**
 * @fileoverview Defines the validation schema for creating snapshots of movie showings during the reservation process.
 */

import {z} from "zod";
import generateArraySchema from "@/shared/utility/schema/generateArraySchema";
import {ValidDateInstanceSchema} from "@/shared/schema/date-time/ValidDateInstanceSchema";
import {PositiveNumberSchema} from "@/shared/schema/numbers/PositiveNumberSchema";
import {BooleanValueSchema} from "@/shared/schema/booleans/BooleanValueSchema";
import {ISO6391LanguageCodeSchema} from "@/shared/schema/enums/ISO6391LanguageCodeSchema";
import {ReservationTypeSchema} from "@/domains/reservation/validation/enums";
import {ReservedSeatSnapshotInputSchema} from "@/domains/seatmap/schema/ReservedSeatSnapshotInputSchema";
import {ScreenSnapshotInputSchema} from "@/domains/screen/_feat/validate-submit";
import {TheatreSnapshotInputSchema} from "@/domains/theatre/validation";
import {MovieSnapshotInputSchema} from "@/domains/movies/_feat/validate-submit";

/** Zod validation schema for reserved showing snapshot input data. */
export const ReservedShowingSnapshotInputSchema = z.object({
    movie: MovieSnapshotInputSchema,
    theatre: TheatreSnapshotInputSchema,
    screen: ScreenSnapshotInputSchema,
    selectedSeats: generateArraySchema(ReservedSeatSnapshotInputSchema).nullable().optional(),
    startTime: ValidDateInstanceSchema,
    endTime: ValidDateInstanceSchema.nullable().optional(),
    language: ISO6391LanguageCodeSchema,
    subtitleLanguages: z.array(ISO6391LanguageCodeSchema).nonempty({message: "Must not be empty."}),
    isSpecialEvent: BooleanValueSchema.optional(),
    pricePaid: PositiveNumberSchema,
    ticketCount: PositiveNumberSchema,
    reservationType: ReservationTypeSchema,
});

/** Type representing the validated input for a reserved showing snapshot. */
export type ReservedShowingSnapshotInputData =
    z.infer<typeof ReservedShowingSnapshotInputSchema>;
