/**
 * @file ReservedShowingSnapshot.types.ts
 *
 * Immutable snapshot field definitions for a reserved movie showing.
 *
 * Captures the fully resolved state of a showing at the moment a
 * reservation is created, including embedded snapshots of:
 * - Theatre
 * - Screen
 * - Movie
 * - Selected seats (if applicable)
 *
 * Used to guarantee historical integrity for reservations, tickets,
 * and financial records, even if upstream entities change later.
 */

import type { ISO6391LanguageCode } from "../../../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type { ScreenSnapshotSchemaFields } from "../../../../screen/model/screen-snapshot/ScreenSnapshot.types.js";
import type { TheatreSchemaFields } from "../../../../theatre/model/Theatre.types.js";
import type { MovieSnapshotSchemaFields } from "../../../../movie/model/movie-snapshot/MovieSnapshot.types.js";
import type { ReservedSeatSnapshotSchemaFields } from "../../../../seatmap/model/seat-map-snapshot/ReservedSeatSnapshot.types.js";
import type { ReservationType } from "../../../schemas/enum/ReservationTypeEnumSchema.js";

/**
 * Immutable snapshot of a reserved showing.
 *
 * @remarks
 * Represents a point-in-time record of the showing as it existed
 * at reservation time. All fields are intended to remain unchanged
 * for the lifetime of the reservation.
 */
export interface ReservedShowingSnapshotSchemaFields {
    /** Theatre snapshot at the time of reservation. */
    theatre: TheatreSchemaFields;

    /** Screen snapshot at the time of reservation. */
    screen: ScreenSnapshotSchemaFields;

    /** Movie snapshot at the time of reservation. */
    movie: MovieSnapshotSchemaFields;

    /** Number of tickets included in the reservation. */
    ticketCount: number;

    /**
     * Selected seat snapshots at reservation time.
     *
     * @remarks
     * Present only for reserved seating reservations.
     */
    selectedSeats?: ReservedSeatSnapshotSchemaFields[] | null;

    /** Scheduled start time of the showing. */
    startTime: Date;

    /**
     * Optional scheduled end time.
     *
     * @remarks
     * If present, must be later than {@link startTime}.
     */
    endTime?: Date | null;

    /** Primary spoken language of the showing (ISO 639-1). */
    language: ISO6391LanguageCode;

    /** Subtitle languages available for the showing (ISO 639-1). */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Indicates whether the showing is a special event screening. */
    isSpecialEvent?: boolean;

    /** Total price paid for the reservation at booking time. */
    pricePaid: number;

    /**
     * Reservation type applied at booking time.
     *
     * @remarks
     * Controls whether {@link selectedSeats} is required or forbidden.
     */
    reservationType: ReservationType;
}
