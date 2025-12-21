/**
 * @file ReservedShowingSnapshot.types.ts
 *
 * @description
 * Immutable snapshot field definitions for a reserved movie showing.
 *
 * Captures the full, finalized state of a showing at reservation time,
 * including embedded snapshots of the theatre, screen, movie, and the
 * exact seats selected. Used to guarantee historical integrity for
 * reservations, tickets, and financial records.
 */

import type { ISO6391LanguageCode } from "../../../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type { ScreenSnapshotSchemaFields } from "../../../../screen/model/screen-snapshot/ScreenSnapshot.types.js";
import type { TheatreSchemaFields } from "../../../../theatre/model/Theatre.types.js";
import type { MovieSnapshotSchemaFields } from "../../../../movie/model/movie-snapshot/MovieSnapshot.types.js";
import type { ReservedSeatSnapshotSchemaFields } from "../seat-map-snapshot/ReservedSeatSnapshot.types.js";

/**
 * Reserved showing snapshot schema fields.
 */
export interface ReservedShowingSnapshotSchemaFields {
    /** Theatre snapshot at reservation time. */
    theatre: TheatreSchemaFields;

    /** Screen snapshot at reservation time. */
    screen: ScreenSnapshotSchemaFields;

    /** Movie snapshot at reservation time. */
    movie: MovieSnapshotSchemaFields;

    /** Seats selected and priced at reservation time. */
    selectedSeats: ReservedSeatSnapshotSchemaFields[];

    /** Scheduled start time of the showing. */
    startTime: Date;

    /** Optional end time; must be later than `startTime` when present. */
    endTime?: Date | null;

    /** Primary spoken language of the showing (ISO-639-1). */
    language: ISO6391LanguageCode;

    /** Subtitle languages available for the showing (ISO-639-1). */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Indicates whether the showing is a special event screening. */
    isSpecialEvent: boolean;

    /** Total price paid for the reservation. */
    pricePaid: number;
}
