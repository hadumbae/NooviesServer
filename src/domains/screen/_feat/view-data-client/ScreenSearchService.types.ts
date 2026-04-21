/**
 * @file ScreenSearchService.types.ts
 *
 * Public contracts and data shapes for screen-based showing searches.
 */

import {Types} from "mongoose";
import type {ScreenSchemaFields} from "@domains/screen/models/screen/Screen.types";
import type {ShowingSchemaFields} from "../../../showing/models/showing/Showing.types";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";

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
    theatreID: Types.ObjectId | SlugString;

    /** Local calendar date (YYYY-MM-DD) */
    dateString: string;
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
