/**
 * @file Types for fetching showings for a movie.
 * @filename ShowingsForMovieService.types.ts
 */

import {Types} from "mongoose";
import type {ISO3166Alpha2CountryCode} from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import type {PositiveInteger} from "../../../../shared/schema/numbers/PositiveIntegerSchema.js";
import type {NonNegativeNumber} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import type {DocumentType} from "../../../../shared/types/mongoose/DocumentType.js";
import type {ShowingSchemaFields} from "../../models/showing/Showing.types.js";

/**
 * Parameters for fetching paginated showings for a movie.
 */
export type FetchShowingsForMovieParams = {
    /** Target movie identifier. */
    movieID: Types.ObjectId;

    queries: {
        /** Page index (1-based). */
        page: PositiveInteger;

        /** Number of items per page. */
        perPage: PositiveInteger;

        /** Country filter (ISO 3166-1 alpha-2). */
        country: ISO3166Alpha2CountryCode;

        /** Optional fuzzy location search. */
        near?: string;
    };
};

/**
 * Paginated result for movie showings.
 */
export type FetchShowingsForMovieReturns = {
    /** Total number of matching documents. */
    totalItems: NonNegativeNumber;

    /** Paginated showing documents. */
    items: DocumentType<ShowingSchemaFields>[];
};