/**
 * @file ShowingSnapshot.types.ts
 *
 * @description
 * Immutable snapshot of a movie showing.
 *
 * Captures the complete state of a showing at creation or booking time to
 * prevent historical data drift when referenced entities (movie, theatre,
 * screen, seating, pricing) change later.
 *
 * Intended for embedding in:
 * - Reservations
 * - Tickets
 * - Audit / history records
 */

import type { MovieSnapshotSchemaFields } from "../../../movie/model/movie-snapshot/MovieSnapshot.types.js";
import type { TheatreSnapshotSchemaFields } from "../../../theatre/model/theatre-snapshot/TheatreSnapshot.types.js";
import type { ScreenSnapshotSchemaFields } from "../../../screen/model/screen-snapshot/ScreenSnapshot.types.js";
import type { SeatMapSnapshotSchemaFields } from "../../../seatmap/model/seat-map-snapshot/SeatMapSnapshot.types.js";

/**
 * Snapshot representation of a showing.
 */
export interface ShowingSnapshotSchemaFields {
    movie: MovieSnapshotSchemaFields;
    theatre: TheatreSnapshotSchemaFields;
    screen: ScreenSnapshotSchemaFields;
    seating: SeatMapSnapshotSchemaFields[];
    startTime: Date;
    endTime?: Date | null;
    ticketPrice: number;
    language: string;
    subtitleLanguages: string[];
    isSpecialEvent: boolean;
}
