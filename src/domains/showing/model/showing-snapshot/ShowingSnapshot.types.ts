/**
 * @file ShowingSnapshot.types.ts
 *
 * @summary
 * Immutable snapshot structure for a movie showing.
 *
 * @description
 * Captures the full state of a showing at the time of creation or booking.
 * This snapshot prevents historical data corruption when referenced entities
 * (movie, theatre, screen, seats, pricing) change in the future.
 *
 * Intended for embedding in:
 * - Reservations
 * - Tickets
 * - Audit / history records
 */

import type { MovieSnapshotSchemaFields } from "../../../movie/model/movie-snapshot/MovieSnapshot.types.js";
import type { TheatreSnapshotSchemaFields } from "../../../theatre/model/theatre-snapshot/TheatreSnapshot.types.js";
import type { SeatSnapshotSchemaFields } from "../../../seat/model/seat-snapshot/SeatSnapshot.types.js";
import type { ScreenSnapshotSchemaFields } from "../../../screen/model/screen-snapshot/ScreenSnapshot.types.js";

/**
 * Fields representing a snapshot of a showing.
 *
 * @remarks
 * - All referenced entities are embedded as snapshots
 * - Pricing and timing fields are frozen at snapshot time
 */
export interface ShowingSnapshotSchemaFields {
    /** Snapshot of the movie being shown */
    movie: MovieSnapshotSchemaFields;

    /** Snapshot of the theatre hosting the showing */
    theatre: TheatreSnapshotSchemaFields;

    /** Snapshot of the seat configuration at time of booking */
    seat: SeatSnapshotSchemaFields;

    /** Snapshot of the screen used for the showing */
    screen: ScreenSnapshotSchemaFields;

    /** Scheduled start time of the showing */
    startTime: Date;

    /** Optional scheduled end time */
    endTime?: Date | null;

    /** Base ticket price at the time of the showing */
    ticketPrice: number;

    /** Primary spoken language of the movie */
    language: string;

    /** Available subtitle languages */
    subtitleLanguages: string[];

    /** Indicates whether this showing is a special event */
    isSpecialEvent: boolean;
}
