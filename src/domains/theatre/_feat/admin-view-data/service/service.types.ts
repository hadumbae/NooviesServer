/**
 * @fileoverview Type definitions for the theatre and screen data aggregation service.
 */

import type { SlugString } from "@shared/schema/strings/SlugStringSchema";
import type { TheatreWithVirtuals } from "@domains/theatre/model/theatre/Theatre.types";
import type { ScreenSchemaFields } from "@domains/screen/models/screen";
import type { SeatSchemaFields } from "@domains/seat/model/Seat.types";

/** Props for the fetchTheatreScreenData service function. */
export type FetchTheatreScreenDataConfig = {
    theatreSlug: SlugString;
    screenSlug: SlugString;
}

/** Composite data structure containing a theatre, a specific screen, and its associated seats. */
export type TheatreScreenData = {
    theatre: TheatreWithVirtuals;
    screen: ScreenSchemaFields;
    seats: SeatSchemaFields[];
}