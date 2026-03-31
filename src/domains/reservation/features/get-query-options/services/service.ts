/**
 * @file Service for parsing and transforming reservation request queries into MongoDB options.
 * @filename ReservationQueryOptionService.ts
 */

import type {Request} from "express";
import type IQueryOptionService from "@shared/types/query-options/IQueryOptionService";
import type {ReservationSchemaFields} from "../../../model/reservation/Reservation.types";
import {ReservationQueryOptionSchema} from "@domains/reservation/features/get-query-options/schemas";
import {RequestValidationError} from "@shared/errors/RequestValidationError";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";
import type {QueryOptionTypes, SortQuery,} from "@shared/types/query-options/QueryOptionService.types";
import type {ReservationQueryMatchFilters, ReservationQueryOptions} from "@domains/reservation/features/get-query-options/schemas";

/**
 * Service responsible for the translation of API query parameters into database-level filters and sorts.
 * ---
 * ### Capabilities
 * * **Validation:** Uses {@link ReservationQueryOptionSchema} to sanitize incoming `req.query` objects.
 * * **Filter Generation:** Maps API-friendly keys (like `showingID`) to DB-specific keys (like `showing`).
 * * **Sort Logic:** Handles multi-directional sorting for reservation-specific dates.
 * * **Attribute Stripping:** Automatically removes `undefined` or `null` filters to prevent empty query matches.
 */
export class ReservationQueryOptionService
    implements IQueryOptionService<ReservationSchemaFields, ReservationQueryOptions, ReservationQueryMatchFilters> {

    /**
     * Extracts and validates reservation query parameters from an Express request.
     * ---
     * @param req - The Express request object containing raw query strings.
     * @returns A validated and typed {@link ReservationQueryOptions} object.
     * @throws {RequestValidationError} 422 - If query parameters fail schema validation.
     */
    fetchQueryParams(req: Request): ReservationQueryOptions {
        const {data, success, error} = ReservationQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new RequestValidationError({
                errors: error?.errors,
                raw: req.query,
                message: "Invalid Reservation Query parameters provided.",
            });
        }

        return data;
    }

    /**
     * Transforms validated options into a Mongoose-compatible filter object.
     * @param options - The validated query options.
     * @returns A clean Mongoose FilterQuery stripped of nullish attributes.
     */
    generateMatchFilters(
        options: ReservationQueryOptions,
    ): FilterQuery<ReservationQueryMatchFilters> {
        const {type, status, userID, showingID} = options;

        return filterNullishAttributes({
            type,
            status,
            user: userID,
            showing: showingID,
        });
    }

    /**
     * Determines the sort order for the database query.
     * @param options - The validated query options.
     * @returns A Mongoose sort object (e.g., `{ dateReserved: -1 }`).
     */
    generateMatchSorts(
        options: ReservationQueryOptions,
    ): SortQuery<ReservationSchemaFields> {
        const {sortByDateReserved} = options;

        return filterNullishAttributes({
            dateReserved: sortByDateReserved,
        });
    }

    /**
     * Compiles filters and sorts into a unified query configuration object.
     * @param options - The validated query options.
     * @returns A structured object containing both match filters and sort directions.
     */
    generateQueryOptions(
        options: ReservationQueryOptions,
    ): QueryOptionTypes<ReservationSchemaFields, ReservationQueryMatchFilters> {
        const matchFilters = this.generateMatchFilters(options);
        const matchSorts = this.generateMatchSorts(options);

        return {
            match: {
                filters: matchFilters,
                sorts: matchSorts,
            },
        };
    }
}