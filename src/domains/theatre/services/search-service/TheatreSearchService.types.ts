/**
 * @file TheatreSearchService.types.ts
 *
 * Public contracts for theatre search operations involving showings.
 */

import type {TheatreSchemaFields} from "../../model/Theatre.types.js";
import type {ShowingSchemaFields} from "../../../showing/model/Showing.types.js";
import type {
    LocationTarget
} from "../../../../shared/schema/features/location-query-options/LocationQueryOptions.types.js";

/**
 * Theatre entity augmented with populated showings.
 *
 * Used as the item shape for theatre search results.
 */
export type ShowingTheatre = TheatreSchemaFields & {
    /** Populated showings associated with the theatre */
    showings: ShowingSchemaFields[];
};

/**
 * Input parameters for fetching theatres with scheduled showings.
 */
export type FetchTheatreByLocationParams = {
    /** Location identifier used to match theatre fields */
    target: LocationTarget;

    /** Page index (1-based) */
    page: number;

    /** Requested number of theatres per page (hard-capped internally) */
    perPage: number;

    /** Optional cap on showings returned per theatre */
    limit?: number;
};

/**
 * Paginated result shape for theatre search queries.
 */
export type FetchTheatreByLocationReturns = {
    /** Paginated theatre results */
    items: ShowingTheatre[];

    /** Total number of matching theatres */
    totalItems: number;
};

/**
 * Theatre search service contract.
 */
export interface TheatreSearchMethods {

    /**
     * Fetches paginated theatres that contain scheduled showings.
     *
     * @param params Location filters and pagination configuration
     * @returns Paginated theatre results with total count
     */
    fetchPaginatedTheatresByLocation(
        params: FetchTheatreByLocationParams,
    ): Promise<FetchTheatreByLocationReturns>;
}
