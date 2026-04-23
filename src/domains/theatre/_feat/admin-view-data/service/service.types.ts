/**
 * @fileoverview Type definitions for the theatre and screen data aggregation service.
 */

import type { SlugString } from "@shared/schema/strings/SlugStringSchema";
import type { TheatreSchemaFields, TheatreWithVirtuals } from "@domains/theatre/model/theatre/Theatre.types";
import type { ScreenSchemaFields } from "@domains/screen/models/screen";
import type { SeatSchemaFields } from "@domains/seat/model";
import type { PaginationReturns } from "@shared/types/PaginationReturns";
import type { ShowingSchemaFields } from "@domains/showing/models/showing/Showing.types";

/**
 * Configuration for fetching specific screen data within the context of a theatre.
 */
export type FetchTheatreScreenDataConfig = {
    theatreSlug: SlugString;
    screenSlug: SlugString;
};

/**
 * Aggregated data structure for a screen view, including
 * its physical layout (seats) and parent theatre context.
 */
export type TheatreScreenData = {
    theatre: TheatreWithVirtuals;
    screen: ScreenSchemaFields;
    seats: SeatSchemaFields[];
};

/**
 * Configuration for fetching data to populate the Theatre Details administrative view.
 */
export type FetchTheatreDetailsViewDataConfig = {
    slug: SlugString;
    screenPage?: number;
    screenPerPage?: number;
    showingLimit?: number;
};

/**
 * Full data payload for the Theatre Details view, containing the primary theatre
 * record, associated scheduled showings, and a paginated list of screens.
 */
export type TheatreDetailsViewData = {
    theatre: TheatreSchemaFields;
    showings: ShowingSchemaFields[];
    screens: PaginationReturns<ScreenSchemaFields>;
};