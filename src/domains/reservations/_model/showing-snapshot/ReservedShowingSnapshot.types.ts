/**
 * @fileoverview Immutable snapshot field definitions for a reserved showing.
 */

import type {ReservationType} from "@/domains/reservations/_validation";
import type {ISO6391LanguageCode} from "@/shared/schema/enums/ISO6391LanguageCodeSchema";
import type {ReservedSeatSnapshotSchemaFields} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.types";
import type {MovieSnapshotSchemaFields} from "@/domains/movies/_models/movie-snapshot/MovieSnapshot.types";
import type {ScreenSnapshotSchemaFields} from "@/domains/screen/models/screen-snapshot";
import type {TheatreSnapshotSchemaFields} from "@/domains/theatre/model/theatre-snapshot";

/** Represents the fully resolved state of a showing at the moment a reservation is created. */
export type ReservedShowingSnapshotSchemaFields = {
    theatre: TheatreSnapshotSchemaFields;
    screen: ScreenSnapshotSchemaFields;
    movie: MovieSnapshotSchemaFields;
    ticketCount: number;
    selectedSeats?: ReservedSeatSnapshotSchemaFields[] | null;
    startTime: Date;
    endTime?: Date | null;
    language: ISO6391LanguageCode;
    subtitleLanguages: ISO6391LanguageCode[];
    isSpecialEvent?: boolean;
    pricePaid: number;
    reservationType: ReservationType;
}
