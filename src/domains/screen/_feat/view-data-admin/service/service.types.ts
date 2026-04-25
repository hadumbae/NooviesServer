/**
 * @fileoverview Data structure definitions for the Theatre Screen Details view.
 * Represents the aggregated state required to render a screen's layout and its parent context.
 */

import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {TheatreWithVirtuals} from "@domains/theatre/model/theatre";
import type {ScreenSchemaFields} from "@domains/screen/models/screen";
import type {SeatSchemaFields} from "@domains/seat/model";

/**
 * Configuration for identifying specific screen data within the theatre hierarchy.
 */
export type FetchTheatreScreenDetailsViewDataConfig = {
    theatreSlug: SlugString;
    screenSlug: SlugString;
};

/**
 * Aggregated data structure for the Screen View.
 */
export type TheatreScreenDetailsViewData = {
    theatre: TheatreWithVirtuals;
    screen: ScreenSchemaFields;
    seats: SeatSchemaFields[];
};