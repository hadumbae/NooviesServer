/**
 * @file ScreenSearchService.types.ts
 *
 * Public contracts and data shapes for screen-based showing searches.
 */

import type {DateTime} from "luxon";
import {Types} from "mongoose";
import type {ScreenSchemaFields} from "../../model/Screen.types.js";
import type {ShowingSchemaFields} from "../../../showing/model/Showing.types.js";

/**
 * Screen entity augmented with populated showings.
 */
export type ScreenWithShowings = ScreenSchemaFields & {
    /** Showings scheduled for this screen */
    showings: ShowingSchemaFields;
};

/**
 * Parameters for fetching showings grouped by screens.
 */
export type ShowingsByScreensParams = {
    /** Target theatre identifier */
    theatreID: Types.ObjectId;

    /** Local calendar date (YYYY-MM-DD) */
    dateString: DateTime;

    /** Maximum number of showings per screen */
    showingLimit: number;
};

/**
 * Contract for screen search services.
 */
export interface ScreenSearchMethods {
    /**
     * Fetches screens with their showings for a given date.
     *
     * @param params - Theatre and date parameters
     * @returns Screens with populated showings
     */
    fetchShowingsByScreens(
        params: ShowingsByScreensParams,
    ): Promise<ScreenWithShowings[]>;
}
