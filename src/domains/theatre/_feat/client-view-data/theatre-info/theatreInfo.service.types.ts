/**
 * @fileoverview Type definitions for fetching client-facing theatre browsing information.
 */

import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {SimpleDateString} from "@shared/schema/date-time/SimpleDateStringSchema";
import type {TheatreSchemaFields} from "@domains/theatre/model/theatre";
import type {ScreenWithShowings} from "@domains/screen/models/screen";

/** Configuration parameters for the request. */
export type FetchTheatreInfoViewDataConfig = {
    theatreSlug: SlugString;
    localDateString?: SimpleDateString;
    limit?: number;
};

/** Representation of the combined theatre and screen data. */
export type TheatreInfoViewData = {
    theatre: TheatreSchemaFields;
    screens: ScreenWithShowings[];
};