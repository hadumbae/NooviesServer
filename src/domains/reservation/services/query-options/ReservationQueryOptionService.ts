import type {Request} from "express";
import type IQueryOptionService from "../../../../shared/types/query-options/IQueryOptionService.js";
import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";
import type {
    ReservationQueryMatchFilters,
    ReservationQueryOptions,
} from "../../schemas/query/ReservationQueryOption.types.js";
import {ReservationQueryOptionSchema} from "../../schemas/query/ReservationQueryOption.schema.js";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {
    QueryOptionTypes,
    SortQuery,
} from "../../../../shared/types/query-options/QueryOptionService.types.js";

/**
 * @file ReservationQueryOptionService.ts
 *
 * Service responsible for parsing, validating, and transforming
 * reservation-related query parameters into MongoDB-compatible
 * query options.
 */

/**
 * Query option service for reservation queries.
 *
 * Handles:
 * - Parsing and validating request query parameters
 * - Generating MongoDB match filters
 * - Generating MongoDB sort options
 * - Producing a unified query option object
 */
export class ReservationQueryOptionService
    implements IQueryOptionService<ReservationSchemaFields, ReservationQueryOptions, ReservationQueryMatchFilters> {

    /**
     * Parse and validate reservation query parameters from an Express request.
     *
     * @param req - Express request object
     * @returns Validated reservation query options
     * @throws ZodParseError If validation fails
     */
    fetchQueryParams(req: Request): ReservationQueryOptions {
        const {data, success, error} = ReservationQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new ZodParseError({
                errors: error?.errors,
                raw: req.query,
                message: "Invalid Showing Query.",
            });
        }

        return data;
    }

    /**
     * Generate MongoDB match filters from query options.
     *
     * Nullish values are stripped to avoid unintended query constraints.
     *
     * @param options - Parsed reservation query options
     * @returns MongoDB filter query for reservations
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
     * Generate MongoDB sort options from query options.
     *
     * @param options - Parsed reservation query options
     * @returns MongoDB sort configuration
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
     * Generate the final query option object consumed by repositories.
     *
     * Combines match filters and sort options into a single structure.
     *
     * @param options - Parsed reservation query options
     * @returns Structured query options for data access
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
