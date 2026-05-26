/**
 * @fileoverview Service for parsing and transforming reservation request queries into MongoDB options.
 */
import type {Request} from "express";
import type IQueryOptionService from "@shared/types/query-options/IQueryOptionService";
import type {ReservationSchemaFields} from "@domains/reservation/model/reservation";
import {ReservationQueryOptionSchema} from "@domains/reservation/features/get-query-options/schemas";
import {RequestValidationError} from "@shared/errors/RequestValidationError";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";
import type {QueryOptionTypes, SortQuery,} from "@shared/types/query-options/QueryOptionService.types";
import type {ReservationQueryMatchFilters, ReservationQueryOptions} from "@domains/reservation/features/get-query-options/schemas";

/** Service responsible for the translation of API query parameters into database-level filters and sorts. */
export class ReservationQueryOptionService
    implements IQueryOptionService<ReservationSchemaFields, ReservationQueryOptions, ReservationQueryMatchFilters> {

    /**
     * Extracts and validates reservation query parameters from an Express request.
     * @param req - The Express request object containing raw query strings.
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

    /** Transforms validated options into a Mongoose-compatible filter object. */
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

    /** Determines the sort order for the database query. */
    generateMatchSorts(
        options: ReservationQueryOptions,
    ): SortQuery<ReservationSchemaFields> {
        const {sortByDateReserved} = options;

        return filterNullishAttributes({
            dateReserved: sortByDateReserved,
        });
    }

    /** Compiles filters and sorts into a unified query configuration object. */
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