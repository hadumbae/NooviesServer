/**
 * @fileoverview Defines the types for the service for fetching showing admin view data.
 */

import type {ShowingSchemaFields} from "@/domains/showing/models/showing/Showing.types";
import type {MovieSchemaFields} from "@/domains/movies/_models/movie";
import type {SeatMapSchemaFields} from "@/domains/seatmap/_model/seat-map/SeatMap.types";
import type {TheatreSchemaFields} from "@/domains/theatre/model/theatre";
import type {ScreenSchemaFields} from "@/domains/screen/models/screen";

/** Configuration for fetching showing details view data. */
export type FetchShowingDetailsViewDataConfig = {
    slug: string;
}

/** Composite data structure for the showing details admin view. */
export type ShowingDetailsViewData = {
    showing: ShowingSchemaFields;
    movie: MovieSchemaFields;
    seating: SeatMapSchemaFields[];
    theatre: TheatreSchemaFields;
    screen: ScreenSchemaFields;
}