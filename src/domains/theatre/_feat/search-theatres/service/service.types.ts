/**
 * @fileoverview Type definitions for the location-based theatre search service.
 */

import type { LocationTarget } from "@shared/schema/features/location-query-options/LocationQueryOptions.types";
import type {TheatreWithShowings} from "@domains/theatre/model/theatre";

/** Props for the fetchTheatresByLocation service function. */
export type FetchTheatreByLocationConfig = {
    target?: LocationTarget;
    page: number;
    perPage: number;
    limit?: number;
};

/** Paginated result set containing theatres with their associated movie showings. */
export type TheatreByLocationReturns = {
    items: TheatreWithShowings[];
    totalItems: number;
};