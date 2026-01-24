/**
 * @file TheatreSearchService.types.ts
 *
 * Public contracts for theatre search operations involving showings.
 */

import type {TheatreSchemaFields} from "../../model/Theatre.types.js";
import type {ShowingSchemaFields} from "../../../showing/model/Showing.types.js";

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
export type FetchShowingTheatreParams = {
    /** Page index (1-based) */
    page: number;

    /** Requested number of theatres per page (hard-capped internally) */
    perPage: number;

    /** Optional cap on showings returned per theatre */
    limit?: number;

    /**
     * Location identifiers used to filter theatres.
     *
     * If omitted, theatres are not location-filtered.
     */
    identifiers: {
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    };
};

/**
 * Paginated result shape for theatre search queries.
 */
export type FetchShowingTheatreReturns = {
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
     * @param params Search filters and pagination configuration
     * @returns Paginated theatre results with total count
     */
    fetchPaginatedTheatresWithShowings(
        params: FetchShowingTheatreParams,
    ): Promise<FetchShowingTheatreReturns>;
}
