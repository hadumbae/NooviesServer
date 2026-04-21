/**
 * @file ReservedShowingSnapshot.types.ts
 *
 * Immutable snapshot field definitions for a reserved showing.
 *
 * Represents the fully resolved state of a showing at the moment a
 * reservation is created, including all embedded snapshot data
 * required for historical, operational, and financial integrity.
 */


import type {ReservationType} from "@domains/reservation/validation/enums";
import type {ISO6391LanguageCode} from "@shared/schema/enums/ISO6391LanguageCodeSchema";
import type {
    ReservedSeatSnapshotSchemaFields
} from "@domains/seatmap/model/seat-map-snapshot/ReservedSeatSnapshot.types";
import type {MovieSnapshotSchemaFields} from "@domains/movie/model/movie-snapshot/MovieSnapshot.types";
import type {TheatreSnapshotSchemaFields} from "@domains/theatre/model/theatre-snapshot/TheatreSnapshot.types";
import type {ScreenSnapshotSchemaFields} from "@domains/screen/models/screen-snapshot";

/**
 * Immutable snapshot of a reserved showing.
 *
 * @remarks
 * This snapshot is authoritative for reservation records and must
 * not be mutated after creation.
 */
export interface ReservedShowingSnapshotSchemaFields {
    /** Theatre snapshot at reservation time. */
    theatre: TheatreSnapshotSchemaFields;

    /** Screen snapshot at reservation time. */
    screen: ScreenSnapshotSchemaFields;

    /** Movie snapshot at reservation time. */
    movie: MovieSnapshotSchemaFields;

    /** Number of tickets included in the reservation. */
    ticketCount: number;

    /**
     * Selected seat snapshots.
     *
     * @remarks
     * Present only for seat-reserved reservation types.
     */
    selectedSeats?: ReservedSeatSnapshotSchemaFields[] | null;

    /** Scheduled start time of the showing. */
    startTime: Date;

    /** Optional scheduled end time of the showing. */
    endTime?: Date | null;

    /** Primary spoken language (ISO 639-1). */
    language: ISO6391LanguageCode;

    /** Available subtitle languages (ISO 639-1). */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Indicates whether the showing is a special event screening. */
    isSpecialEvent?: boolean;

    /** Total price paid at booking time. */
    pricePaid: number;

    /**
     * Reservation type applied at booking time.
     *
     * @remarks
     * Determines whether seat selection is required.
     */
    reservationType: ReservationType;
}
